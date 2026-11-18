// Copyright (C) 2026 Skaperiet (Joachim Haagen Skeie)
// SPDX-License-Identifier: AGPL-3.0-only
// src/lib/akse/stlExporter.ts

import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import type { CompiledMesh } from './csgEngine';
import type { AkseTexts } from '$lib/texts';
import { interpolate } from '$lib/texts';

export interface ExportValidation {
  ok: boolean;
  warning?: string;
  outOfBounds?: boolean;
}

export interface ExportResult {
  buffer: ArrayBuffer;
  triangleCount: number;
  bounds: { min: [number, number, number]; max: [number, number, number] };
}

/**
 * Validér før eksport. Caller kan vise advarsler, og avgjøre om eksport skal fortsette.
 */
export function validateForExport(
  compiled: CompiledMesh[],
  workplaneSize: [number, number, number],
  texts: Pick<AkseTexts, 'exportEmpty' | 'exportBelowPlate' | 'exportFloating' | 'exportOutOfBounds'>,
): ExportValidation {
  const meshes = compiled.filter((c) => c.mesh).map((c) => c.mesh!);
  if (meshes.length === 0) {
    return { ok: false, warning: texts.exportEmpty };
  }

  const overall = new THREE.Box3();
  for (const m of meshes) {
    m.geometry.computeBoundingBox();
    overall.union(m.geometry.boundingBox!);
  }
  const [w, d, h] = workplaneSize;
  const min = overall.min;
  const max = overall.max;
  // I Three.js: X=bredde, Y=høyde (z bruker), Z=dybde (y bruker). Printplaten er ved Y=0.
  const EPS = 0.1;  // mm toleranse for "ligger på platen"

  // Noe stikker under printplaten?
  if (min.y < -EPS) {
    return {
      ok: false,
      warning: texts.exportBelowPlate,
    };
  }
  // Alt svever over platen — ingenting hviler på den?
  if (min.y > EPS) {
    return {
      ok: false,
      warning: texts.exportFloating,
    };
  }

  // Utenfor printområdet (horisontalt eller for høyt) — myk advarsel, kan eksporteres likevel.
  if (
    min.x < -w / 2 || max.x > w / 2 ||
    min.z < -d / 2 || max.z > d / 2 ||
    max.y > h
  ) {
    return {
      ok: true,
      outOfBounds: true,
      warning: interpolate(texts.exportOutOfBounds, { size: `${w}×${d}×${h}` }),
    };
  }
  return { ok: true };
}

export function exportProjectToSTL(compiled: CompiledMesh[]): ExportResult {
  const meshes = compiled.filter((c) => c.mesh).map((c) => c.mesh!);
  if (meshes.length === 0) {
    throw new Error('Cannot export an empty project. Call validateForExport first.');
  }

  const scene = new THREE.Scene();
  for (const m of meshes) {
    scene.add(m.clone());
  }
  // Three.js-scenen er Y-opp; STL/slicer-rom (og brukerens koordinatsystem) er
  // Z-opp. Roter +90° om X slik at brukerens Z-akse (høyde) blir slicerens Z-akse.
  // Uten dette havner modellen på høykant i slicer-programmet. Rotasjonen settes
  // på scene-noden, ikke på geometrien, så den delte (cachede) geometrien ikke
  // muteres — STLExporter baker matrixWorld inn i de eksporterte verteksene.
  scene.rotation.x = Math.PI / 2;
  scene.updateMatrixWorld(true);
  const exporter = new STLExporter();
  // STLExporter.parse(binary) typer returverdien som DataView i nyere @types/three;
  // bufferet er en ekte ArrayBuffer i runtime. Cast via unknown for streng TS.
  const buffer = exporter.parse(scene, { binary: true }) as unknown as ArrayBuffer;

  let triangleCount = 0;
  const overall = new THREE.Box3();
  for (const m of meshes) {
    const idx = m.geometry.index;
    const pos = m.geometry.attributes.position;
    triangleCount += (idx ? idx.count : pos.count) / 3;
    m.geometry.computeBoundingBox();
    overall.union(m.geometry.boundingBox!);
  }

  // Swap Three.js (X, Y=opp, Z) → bruker-rom (X, Y, Z=opp) for utgående bounds.
  return {
    buffer,
    triangleCount,
    bounds: {
      min: [overall.min.x, overall.min.z, overall.min.y],
      max: [overall.max.x, overall.max.z, overall.max.y],
    },
  };
}
