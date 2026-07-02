'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import {
  useRef,
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { easing } from 'maath';

useGLTF.preload('/assets/3d/lens.glb');

/**
 * Scroll-driven Fluid Glass Lens.
 *
 * The lens position is controlled externally via `targetRef.current = { x, y }`
 * where x/y are normalized [-1..1] in viewport units (relative to the canvas).
 * This lets the parent section drive the lens position from window scroll
 * progress instead of pointer tracking.
 *
 * @prop {{current:{x:number,y:number}}} targetRef  external position target
 * @prop {ReactNode} children                       scene rendered behind the lens
 * @prop {object}    lensProps                      MeshTransmissionMaterial props
 *                   (scale, ior, thickness, chromaticAberration, anisotropicBlur, ...)
 */
const ScrollLens = memo(function ScrollLens({
  targetRef,
  children,
  lensProps = {},
  bgColor = '#0a0a0a',
}) {
  const ref = useRef(null);
  const { nodes } = useGLTF('/assets/3d/lens.glb');
  const buffer = useFBO({
    samples: 0, // Background is just images, no need for heavy MSAA
    depth: false, // No depth buffer needed for 2D images
  });
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  const {
    scale = 0.35,
    ior = 1.02,
    thickness = 1.1,
    chromaticAberration = 0.022,
    anisotropicBlur = 0,
    ...extraMat
  } = lensProps;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const { gl, viewport, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const tx = targetRef?.current?.x ?? 0;
    const ty = targetRef?.current?.y ?? 0;

    // tx/ty are normalized [-1..1] - convert to world space
    const destX = (tx * v.width) / 2;
    const destY = (ty * v.height) / 2;

    easing.damp3(ref.current.position, [destX, destY, 15], 0.055, delta);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(bgColor, 0);
  });

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale}
        rotation-x={Math.PI / 2}
        geometry={nodes.Cylinder?.geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          chromaticAberration={chromaticAberration}
          anisotropicBlur={anisotropicBlur}
          resolution={1024} // Cap internal resolution
          {...extraMat}
        />
      </mesh>
    </>
  );
});

/**
 * Outer wrapper: the <Canvas> + ScrollLens.
 * Children are rendered into the off-screen scene (behind the lens).
 */
const FluidGlassScroll = forwardRef(function FluidGlassScroll(
  { children, lensProps, bgColor, className, style },
  fwdRef
) {
  const targetRef = useRef({ x: 0, y: 0 });

  useImperativeHandle(
    fwdRef,
    () => ({
      setTarget(x, y) {
        targetRef.current.x = x;
        targetRef.current.y = y;
      },
      get target() {
        return targetRef.current;
      },
    }),
    []
  );

  return (
    <Canvas
      className={className}
      style={style}
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <ScrollLens targetRef={targetRef} lensProps={lensProps} bgColor={bgColor}>
        {children}
        <Preload all />
      </ScrollLens>
    </Canvas>
  );
});

export default FluidGlassScroll;
