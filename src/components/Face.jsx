import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import {
  EffectComposer,
  ChromaticAberration,
  Bloom,
} from "@react-three/postprocessing";
import { Resizer, KernelSize, BlendFunction } from "postprocessing";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

function Box() {
  const ref = useRef();
  const [target, setTarget] = useState({ x: 0, y: (-30 * 3.14) / 180 });
  // Hold state for hovered and clicked events
  const mtl = useLoader(MTLLoader, "./model/model.mtl");
  const obj = useLoader(OBJLoader, "./model/model.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  useEffect(() => {
    ref.current.rotation.x = target.x;
    ref.current.rotation.y = target.y;

    const fn = () => {
      setTarget({
        y: Math.random() * (3.14 / 2) - 3.14 / 4,
        x: (Math.random() > 0.5 ? 25 : -25 * 3.14) / 180,
      });
    };

    setInterval(fn, 3000);
    return () => clearInterval(fn);
  }, []);

  useFrame((_, delta) => {
    if (delta < 1) {
      let distX = target.x - ref.current.rotation.x;
      let distY = target.y - ref.current.rotation.y;
      ref.current.rotation.x += distX * delta;
      ref.current.rotation.y += distY * delta;
    }
  });

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={ref}>
        <primitive position={[0, 0, 48]} scale={140} object={obj} />
      </mesh>
    </>
  );
}

export default function Face() {
  return (
    <div class="h-60">
      <Canvas
        orthographic
        camera={{ zoom: 10, near: -100, far: 100, position: [0, 0, 0] }}
      >
        <EffectComposer>
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.008, 0.008]} // color offset
          />
          <Bloom
            intensity={1.0} // The bloom intensity.
            blurPass={undefined} // A blur pass.
            width={Resizer.AUTO_SIZE} // render width
            height={Resizer.AUTO_SIZE} // render height
            kernelSize={KernelSize.SMALL} // blur kernel size
            luminanceThreshold={0.2} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          />
        </EffectComposer>
        <Box></Box>
      </Canvas>
    </div>
  );
}
