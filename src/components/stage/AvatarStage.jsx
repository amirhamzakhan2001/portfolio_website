import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Center, Bounds } from '@react-three/drei'

/**
 * The 3D avatar.
 *
 * Loaded only once a model actually exists at /models/avatar.glb — see
 * Stage.jsx, which probes for the file and lazy-imports this module. That
 * keeps three.js out of the bundle entirely until there is something to
 * render with it.
 *
 * The model orbits gently, leans toward the cursor, and turns with scroll.
 */

function Model({ url, pointer, scrollRef }) {
  const { scene } = useGLTF(url)
  const group = useRef()

  useFrame((state, dt) => {
    if (!group.current) return
    const targetY = pointer.current.x * 0.5 + scrollRef.current * Math.PI * 0.9
    const targetX = -pointer.current.y * 0.18
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, dt * 4)
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, dt * 4)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

export default function AvatarStage({ url = '/models/avatar.glb' }) {
  const pointer = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const wrap = useRef(null)

  const onMove = (e) => {
    const r = wrap.current?.getBoundingClientRect()
    if (!r) return
    pointer.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    }
  }

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
      className="h-full w-full"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 3.2], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 3]} intensity={2.1} castShadow />
        <directionalLight position={[-3, 1, -2]} intensity={0.7} color="#FF3D00" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <Center>
              <Model url={url} pointer={pointer} scrollRef={scrollRef} />
            </Center>
          </Bounds>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows position={[0, -1.1, 0]} opacity={0.32} scale={7} blur={2.6} far={3} />
      </Canvas>
    </div>
  )
}
