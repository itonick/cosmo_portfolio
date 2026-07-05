/**
 * 05 — Cosmic Web (large-scale structure)
 * Ported from design/Cosmic_Portfolio.dc.html:651-697 (_buildWeb).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { g, points, sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

type Vec3Tuple = [number, number, number];

export function buildWeb(ctx: PhenomenonContext): PhenomenonResult {
  const { density, config } = ctx;
  const P = PALETTE.phenomena.web;
  const group = new THREE.Group();
  group.position.set(0, 0, P.z);
  group.rotation.x = P.rotation.x;
  const anims: Array<(t: number, dt: number) => void> = [];

  const centers: Vec3Tuple[] = [];
  for (let i = 0; i < P.superclusterCount; i++) {
    centers.push([(Math.random() - 0.5) * 46, (Math.random() - 0.5) * 32, (Math.random() - 0.5) * 40]);
  }

  const nodes: Vec3Tuple[] = [];
  const nn = Math.floor(P.clusterNodeCount * density);
  for (let i = 0; i < nn; i++) {
    const c = centers[Math.floor(Math.random() * centers.length)];
    nodes.push([c[0] + g() * 7, c[1] + g() * 7, c[2] + g() * 7]);
  }
  for (let i = 0; i < P.fieldNodeCount; i++) {
    nodes.push([(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 42, (Math.random() - 0.5) * 50]);
  }

  const pos: number[] = [];
  const col: number[] = [];
  const cA = new THREE.Color(P.colors.blue);
  const cB = new THREE.Color(P.colors.violet);
  const cW = new THREE.Color(P.colors.white);
  for (const nd of nodes) {
    pos.push(nd[0], nd[1], nd[2]);
    const c = Math.random() < 0.08 ? cW : Math.random() < 0.5 ? cA : cB;
    const f = 0.4 + Math.random() * 0.6;
    col.push(c.r * f, c.g * f, c.b * f);
  }
  group.add(points(pos, col, P.pointSize, P.pointOpacity));

  const deg = new Array(nodes.length).fill(0);
  const epos: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (deg[i] >= P.maxNodeDegree || deg[j] >= P.maxNodeDegree) continue;
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      if (dx * dx + dy * dy + dz * dz < P.edgeConnectionDistanceSq) {
        epos.push(nodes[i][0], nodes[i][1], nodes[i][2], nodes[j][0], nodes[j][1], nodes[j][2]);
        deg[i]++;
        deg[j]++;
      }
    }
  }
  const eg = new THREE.BufferGeometry();
  eg.setAttribute('position', new THREE.Float32BufferAttribute(epos, 3));
  group.add(
    new THREE.LineSegments(
      eg,
      new THREE.LineBasicMaterial({
        color: P.colors.edge,
        transparent: true,
        opacity: P.edgeOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
  );

  for (let i = 0; i < P.clusterHaloCount; i++) {
    const c = centers[i];
    const s = sprite('rgba(180,160,250,0.6)', 'rgba(100,90,200,0.12)', 7, 0.25);
    s.position.set(c[0], c[1], c[2]);
    group.add(s);
  }

  anims.push((t, dt) => {
    group.rotation.y += dt * P.yRotationSpeed * config.speed;
    group.rotation.x = P.rotation.x + Math.sin(t * P.rotation.xOscillationFrequency) * P.rotation.xOscillationAmplitude;
  });

  return { group, anims };
}
