/**
 * Cosmic Portfolio — 3D Scene Palette & Configuration
 *
 * Source: design/README.md (primary specification)
 * Source: design/Cosmic_Portfolio.dc.html (implementation values)
 */

export const PALETTE = {
  /* ========== Camera ========== */
  /* design/README.md:140, design/Cosmic_Portfolio.dc.html:415 */

  camera: {
    fov: 58,
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:415 */

    near: 0.1,
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:415 */

    far: 600,
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:415 */

    initialPosition: { x: 0, y: 3, z: 56 },
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:416 */
  },

  /* ========== Fog ========== */
  /* design/README.md:140, design/Cosmic_Portfolio.dc.html:414 */

  fog: {
    color: 0x04060f,
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:414 */

    coefficient: 0.0072,
    /* design/README.md:140, design/Cosmic_Portfolio.dc.html:414 */
  },

  /* ========== Rendering ========== */

  renderer: {
    pixelRatio: 2,
    /* design/README.md:140 — capped at 2 */

    antialias: true,
    /* design/README.md:140 */
  },

  /* ========== Camera Motion & Easing ========== */
  /* design/README.md:144–149 */

  easing: {
    /* Scroll interpolation (exponential smoothing) */
    segmentFactor: 0.07,
    /* design/Cosmic_Portfolio.dc.html:719 */

    progressFactor: 0.07,
    /* design/Cosmic_Portfolio.dc.html:720 */

    mouseFactor: 0.05,
    /* design/Cosmic_Portfolio.dc.html:721–722 */

    dt_clamp: 0.1,
    /* design/README.md:149, design/Cosmic_Portfolio.dc.html:717 */
  },

  /* ========== Idle Sway ========== */
  /* design/README.md:145, design/Cosmic_Portfolio.dc.html:727–738 */

  idleSway: {
    xAmplitude: 0.7,
    /* design/README.md:145, design/Cosmic_Portfolio.dc.html:727 */

    xFrequency: 0.3,
    /* design/README.md:145 */

    yAmplitude: 0.5,
    /* design/README.md:145, design/Cosmic_Portfolio.dc.html:727 */

    yFrequency: 0.22,
    /* design/README.md:145 */

    rollAmplitude: 0.015,
    /* design/README.md:145 */

    rollFrequency: 0.13,
    /* design/README.md:145, design/Cosmic_Portfolio.dc.html:738 */
  },

  /* ========== FOV Warp ========== */
  /* design/README.md:146, design/Cosmic_Portfolio.dc.html:740 */

  fovWarp: {
    baseFov: 58,
    /* design/README.md:146 */

    maxWarp: 9,
    /* design/README.md:146, design/Cosmic_Portfolio.dc.html:740 */

    warpCoefficient: 26,
    /* design/README.md:146, design/Cosmic_Portfolio.dc.html:740 */
  },

  /* ========== Mouse Parallax ========== */
  /* design/README.md:147, design/Cosmic_Portfolio.dc.html:726 */

  parallax: {
    coefficient: 3.2,
    /* design/README.md:147, design/Cosmic_Portfolio.dc.html:726 */

    yDamping: 0.6,
    /* design/Cosmic_Portfolio.dc.html:730 */

    lookAtXDamping: 0.3,
    /* design/Cosmic_Portfolio.dc.html:734 */

    lookAtYDamping: 0.2,
    /* design/Cosmic_Portfolio.dc.html:735 */
  },

  /* ========== Scene Layout ========== */
  /* design/README.md:142, design/Cosmic_Portfolio.dc.html:428–431 */

  sceneLayout: {
    /* Z positions (depth along -Z axis) */
    z: [0, -170, -340, -510, -680],
    /* design/README.md:142, design/Cosmic_Portfolio.dc.html:428 */

    /* X offsets (horizontal spread) */
    x: [0, -9, 0, 9, 0],
    /* design/README.md:142, design/Cosmic_Portfolio.dc.html:429 */

    /* Waypoint y coordinate (section 0 = 3, others = 0) */
    waypointY: 3,
    /* design/README.md:142, design/Cosmic_Portfolio.dc.html:430 */

    /* Waypoint z offset (z + 56) */
    waypointZOffset: 56,
    /* design/README.md:142, design/Cosmic_Portfolio.dc.html:430 */
  },

  /* ========== Phenomena: Colors ========== */

  phenomena: {
    /* 01 - Hexagonal Storm */
    /* design/README.md:157, design/Cosmic_Portfolio.dc.html:488 */

    storm: {
      z: 0,
      colors: {
        inner: 0xf2f6ff,
        /* design/README.md:157 */

        mid: 0x4a9de8,
        /* design/README.md:157 */

        outer: 0x8a5cf5,
        /* design/README.md:157 */
      },
      rotation: {
        x: -0.5,
        /* design/README.md:157, design/Cosmic_Portfolio.dc.html:487 */
      },
      bands: [
        {
          r0: 0.5,
          r1: 6,
          hex: 0,
          n: 2400,
          /* design/Cosmic_Portfolio.dc.html:490 */

          speed: 0.2,
          /* design/README.md:157, design/Cosmic_Portfolio.dc.html:490 */
        },
        {
          r0: 6,
          r1: 11.5,
          hex: 0.35,
          n: 3000,
          /* design/Cosmic_Portfolio.dc.html:491 */

          speed: 0.08,
          /* design/README.md:157, design/Cosmic_Portfolio.dc.html:491 */
        },
        {
          r0: 11.5,
          r1: 15.6,
          hex: 1,
          n: 3200,
          /* design/Cosmic_Portfolio.dc.html:492 */

          speed: 0.05,
          /* design/README.md:157, design/Cosmic_Portfolio.dc.html:492 */
        },
      ],
      hexOutlines: {
        radii: [16.4, 17.6],
        /* design/README.md:157, design/Cosmic_Portfolio.dc.html:510 */

        speed: 0.05,
        /* design/README.md:157, design/Cosmic_Portfolio.dc.html:516 */
      },
      pointSize: 0.42,
      /* design/Cosmic_Portfolio.dc.html:506 */

      pointOpacity: 0.9,
      /* design/Cosmic_Portfolio.dc.html:506 */
    },

    /* 02 - Einstein Ring */
    /* design/README.md:158, design/Cosmic_Portfolio.dc.html:524–558 */

    ring: {
      z: -170,
      colors: {
        lens: 0xf0f4ff,
        /* design/Cosmic_Portfolio.dc.html:528 */

        particle: [0x7db8f5, 0x9d8af5],
        /* design/Cosmic_Portfolio.dc.html:532 */

        torus: 0x88b4f0,
        /* design/Cosmic_Portfolio.dc.html:544 */

        arc: 0xbfd8ff,
        /* design/Cosmic_Portfolio.dc.html:548 */

        glowCluster: 0xdce6ff,
        /* design/Cosmic_Portfolio.dc.html:554 */
      },
      lensScale: 6.5,
      /* design/Cosmic_Portfolio.dc.html:528 */

      lensOpacity: 0.85,
      /* design/Cosmic_Portfolio.dc.html:528 */

      ringRadius: 13.5,
      /* design/README.md:158, design/Cosmic_Portfolio.dc.html:535 */

      ringParticleCount: 2600,
      /* design/Cosmic_Portfolio.dc.html:531 */

      ringSpeed: 0.11,
      /* design/README.md:158, design/Cosmic_Portfolio.dc.html:543 */

      torusRadius: 13.5,
      /* design/Cosmic_Portfolio.dc.html:544 */

      torusThickness: 0.06,
      /* design/Cosmic_Portfolio.dc.html:544 */

      torusRadialSegments: 8,
      /* design/Cosmic_Portfolio.dc.html:544 */

      torusTubularSegments: 220,
      /* design/Cosmic_Portfolio.dc.html:544 */

      arcOffsets: [0.6, Math.PI + 0.6],
      /* design/Cosmic_Portfolio.dc.html:546 */

      arcSpeed: 0.08,
      /* design/Cosmic_Portfolio.dc.html:551 */

      backgroundGlows: 10,
      /* design/Cosmic_Portfolio.dc.html:553 */
    },

    /* 03 - Square Nebula */
    /* design/README.md:159, design/Cosmic_Portfolio.dc.html:561–606 */

    nebula: {
      z: -340,
      colors: {
        a: 0x8a5cf5,
        /* design/README.md:159, design/Cosmic_Portfolio.dc.html:567 */

        b: 0x4a9de8,
        /* design/README.md:159, design/Cosmic_Portfolio.dc.html:567 */
      },
      rotation: {
        z: 0.08,
        /* design/README.md:159, design/Cosmic_Portfolio.dc.html:565 */

        /* Slow oscillation */
        zOscillationAmplitude: 0.02,
        /* design/Cosmic_Portfolio.dc.html:605 */

        zOscillationFrequency: 0.15,
        /* design/Cosmic_Portfolio.dc.html:605 */
      },
      halfSize: 11,
      /* design/README.md:159, design/Cosmic_Portfolio.dc.html:566 */

      particleCount: 5200,
      /* design/Cosmic_Portfolio.dc.html:568 */

      frameEdgeBias: 0.72,
      /* design/Cosmic_Portfolio.dc.html:571 */

      squareOutlines: [11, 13.0 /* H * 1.18 */],
      /* design/README.md:159, design/Cosmic_Portfolio.dc.html:588 */

      pointSize: 0.4,
      /* design/Cosmic_Portfolio.dc.html:586 */

      pointOpacity: 0.85,
      /* design/Cosmic_Portfolio.dc.html:586 */
    },

    /* 04 - Golden Spiral */
    /* design/README.md:160–161, design/Cosmic_Portfolio.dc.html:609–648 */

    spiral: {
      z: -510,
      colors: {
        core: 0xfff2d8,
        /* design/README.md:160, design/Cosmic_Portfolio.dc.html:616 */

        gold: 0xe0b866,
        /* design/README.md:160, design/Cosmic_Portfolio.dc.html:616 */

        blue: 0x4a9de8,
        /* design/README.md:160, design/Cosmic_Portfolio.dc.html:616 */
      },
      rotation: {
        x: -0.45,
        /* design/README.md:160, design/Cosmic_Portfolio.dc.html:613 */
      },
      speed: -0.04,
      /* design/README.md:160, design/Cosmic_Portfolio.dc.html:647 */

      /* Logarithmic spiral parameters: r = a * e^(b*θ) */
      /* where b = ln(φ) / (π/2), φ = golden ratio */

      a: 0.32,
      /* design/Cosmic_Portfolio.dc.html:615 */

      /* b calculated as ln(φ)/(π/2) */
      bFormula: "Math.log(PHI) / (Math.PI / 2)",
      /* design/README.md:160, design/Cosmic_Portfolio.dc.html:615 */

      thetaMax: 4.1 * Math.PI,
      /* design/README.md:160, design/Cosmic_Portfolio.dc.html:615 */

      armOffsets: [0, Math.PI],
      /* design/README.md:160, design/Cosmic_Portfolio.dc.html:617 */

      armParticleCount: 3800,
      /* design/Cosmic_Portfolio.dc.html:619 */

      bulgeParticleCount: 1400,
      /* design/Cosmic_Portfolio.dc.html:632 */

      pointSize: 0.4,
      /* design/Cosmic_Portfolio.dc.html:630 */

      pointOpacity: 0.9,
      /* design/Cosmic_Portfolio.dc.html:630 */
    },

    /* 05 - Cosmic Web */
    /* design/README.md:161, design/Cosmic_Portfolio.dc.html:651–696 */

    web: {
      z: -680,
      colors: {
        blue: 0x4a9de8,
        /* design/Cosmic_Portfolio.dc.html:666 */

        violet: 0x9d8af5,
        /* design/Cosmic_Portfolio.dc.html:666 */

        white: 0xeef2fa,
        /* design/Cosmic_Portfolio.dc.html:666 */

        edge: 0x4a7ad6,
        /* design/README.md:161, design/Cosmic_Portfolio.dc.html:688 */
      },
      rotation: {
        x: 0.15,
        /* design/README.md:161, design/Cosmic_Portfolio.dc.html:655 */

        /* Subtle oscillation on x */
        xOscillationAmplitude: 0.05,
        /* design/Cosmic_Portfolio.dc.html:695 */

        xOscillationFrequency: 0.2,
        /* design/Cosmic_Portfolio.dc.html:695 */
      },
      yRotationSpeed: 0.055,
      /* design/README.md:161, design/Cosmic_Portfolio.dc.html:695 */

      superclusterCount: 11,
      /* design/README.md:161, design/Cosmic_Portfolio.dc.html:657 */

      clusterNodeCount: 300,
      /* design/README.md:161, design/Cosmic_Portfolio.dc.html:659 */

      fieldNodeCount: 40,
      /* design/README.md:161, design/Cosmic_Portfolio.dc.html:664 */

      edgeConnectionDistanceSq: 72,
      /* design/README.md:161 — sqrt(72), design/Cosmic_Portfolio.dc.html:680 */

      maxNodeDegree: 5,
      /* design/README.md:161, design/Cosmic_Portfolio.dc.html:678 */

      edgeOpacity: 0.2,
      /* design/Cosmic_Portfolio.dc.html:688 */

      clusterHaloCount: 4,
      /* design/Cosmic_Portfolio.dc.html:689 */

      pointSize: 0.5,
      /* design/Cosmic_Portfolio.dc.html:673 */

      pointOpacity: 0.95,
      /* design/Cosmic_Portfolio.dc.html:673 */
    },
  },

  /* ========== Ambient Layers ========== */

  starfield: {
    count: 2600,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:700 */

    zMin: 60,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:702 */

    zMax: -760,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:702 */

    /* Twinkle formula: opacity = 0.55 + sin(t*1.6)*0.15 + sin(t*4.3)*0.07 */

    baseLuminance: 0.55,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:708 */

    twinkle1Frequency: 1.6,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:708 */

    twinkle1Amplitude: 0.15,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:708 */

    twinkle2Frequency: 4.3,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:708 */

    twinkle2Amplitude: 0.07,
    /* design/README.md:164, design/Cosmic_Portfolio.dc.html:708 */

    pointSize: 0.35,
    /* design/Cosmic_Portfolio.dc.html:707 */

    pointOpacity: 0.7,
    /* design/Cosmic_Portfolio.dc.html:707 */
  },

  comets: {
    count: 3,
    /* design/README.md:165, design/Cosmic_Portfolio.dc.html:373 */

    scale: { x: 5.5, y: 0.4 },
    /* design/README.md:165, design/Cosmic_Portfolio.dc.html:399 */

    lifeMin: 2.2,
    /* design/README.md:165, design/Cosmic_Portfolio.dc.html:397 */

    lifeMax: 5.0,
    /* design/README.md:165, design/Cosmic_Portfolio.dc.html:397 */
  },
} as const;

export const SCENE = {
  /* ========== Configurable Props (with ranges) ========== */
  /* design/README.md:177–186 */

  props: {
    tone: {
      options: ['observatory', 'poetic', 'minimal'],
      /* design/README.md:179–182, design/Cosmic_Portfolio.dc.html:200 */

      default: 'observatory',
      /* design/README.md:179 */
    },
    speed: {
      min: 0.2,
      max: 2.5,
      default: 1,
      /* design/README.md:184, design/Cosmic_Portfolio.dc.html:200 */
    },
    parallax: {
      min: 0,
      max: 2,
      default: 1,
      /* design/README.md:185, design/Cosmic_Portfolio.dc.html:200 */
    },
    density: {
      min: 0.4,
      max: 1.6,
      default: 1,
      internalMin: 0.3,
      /* design/Cosmic_Portfolio.dc.html:427 */

      internalMax: 2,
      /* design/Cosmic_Portfolio.dc.html:427 */

      /* design/README.md:186, design/Cosmic_Portfolio.dc.html:427 */
    },
  },

  /* ========== HUD Telemetry Labels & Coordinates ========== */
  /* design/README.md:132–133, design/Cosmic_Portfolio.dc.html:211–212 */

  hud: {
    telemetry: [
      {
        label: 'OBS.01 — HEXAGONAL STORM',
        /* design/README.md:133 */

        coordinate: 'SATURN — 78.1°N / Ø 29,000 KM',
        /* design/README.md:133 */
      },
      {
        label: 'OBS.02 — EINSTEIN RING',
        /* design/README.md:133 */

        coordinate: 'LRG 3-757 — COSMIC HORSESHOE',
        /* design/README.md:133 */
      },
      {
        label: 'OBS.03 — SQUARE NEBULA',
        /* design/README.md:133 */

        coordinate: 'MWC 922 — RED SQUARE NEBULA',
        /* design/README.md:133 */
      },
      {
        label: 'OBS.04 — GOLDEN SPIRAL',
        /* design/README.md:133 */

        coordinate: 'M51 — LOGARITHMIC SPIRAL / φ',
        /* design/README.md:133 */
      },
      {
        label: 'OBS.05 — COSMIC WEB',
        /* design/README.md:133 */

        coordinate: 'LANIAKEA — 520 MLY',
        /* design/README.md:133 */
      },
    ],
  },

  /* ========== Click Burst Particles ========== */
  /* design/README.md:172, design/Cosmic_Portfolio.dc.html:291–304 */

  clickBurst: {
    colors: ['#7db8f5', '#b48af8', '#e0b866', '#f0f4fc'],
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:292 */

    count: 12,
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:293 */

    sizeMin: 3,
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:295 */

    sizeMax: 7,
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:295 */

    durationMin: 0.6,
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:303 */

    durationMax: 1.1,
    /* design/README.md:172, design/Cosmic_Portfolio.dc.html:303 */

    spreadDistance: { min: 30, max: 100 },
    /* design/Cosmic_Portfolio.dc.html:299 */

    ease: 'cubic-bezier(0.22,1,0.36,1)',
    /* design/Cosmic_Portfolio.dc.html:303 */
  },

  /* ========== Loader ========== */
  /* design/README.md:173, design/Cosmic_Portfolio.dc.html:223 */

  loader: {
    visibleDuration: 900,
    /* design/Cosmic_Portfolio.dc.html:423 */

    fadeOutDuration: 800,
    /* design/Cosmic_Portfolio.dc.html:288 */

    hardTimeoutDuration: 4000,
    /* design/Cosmic_Portfolio.dc.html:223 */
  },
} as const;
