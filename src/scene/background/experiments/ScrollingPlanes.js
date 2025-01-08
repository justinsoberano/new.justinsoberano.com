import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDevice } from '../../../common/useDevice'

const BASE_WIDTH = 1.6
const BASE_HEIGHT = BASE_WIDTH * (9/16)

const CarouselPlane = ({ position, color, width = BASE_WIDTH, height = BASE_HEIGHT }) => {
  const meshRef = useRef()
  useFrame(() => meshRef.current && (meshRef.current.position.x = position[0]))
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const ScrollingRow = ({ 
  planeData, yOffset = 0, direction = 1,
  speed = 0.005, baseSpeed = 0.75 
}) => {
  const { viewport } = useThree()
  const [planes, setPlanes] = useState([])
  const { type } = useDevice()

  const MIN_PLANE_WIDTH = type === 'Desktop' ? 0.7 : 1.5
  const FIXED_SPACING = type === 'Desktop' ? 0.06 : 0.1
  const MIN_VIEWPORT_SCALE = MIN_PLANE_WIDTH / BASE_WIDTH

  const planeWidth = BASE_WIDTH * MIN_VIEWPORT_SCALE
  const totalSpacing = planeWidth + FIXED_SPACING
  const boundaries = [(viewport.width / 2) + planeWidth, -(viewport.width / 2) - planeWidth]

  useEffect(() => {
    setPlanes(planeData.map((plane, i) => ({ 
      ...plane, 
      position: [
        (-totalSpacing * (planeData.length/2)) + (totalSpacing * i), 
        yOffset * MIN_VIEWPORT_SCALE, 
        0
      ] 
    })))
  }, [viewport.width, yOffset, planeData, MIN_VIEWPORT_SCALE, FIXED_SPACING])

  useFrame(() => {
    const currentSpeed = speed * baseSpeed * Math.max(Math.cbrt(viewport.width / 10), MIN_VIEWPORT_SCALE) * direction
    setPlanes(prev => prev.map(plane => {
      const newX = plane.position[0] - currentSpeed
      const resetX = direction > 0 
        ? Math.max(...prev.map(p => p.position[0])) + totalSpacing
        : Math.min(...prev.map(p => p.position[0])) - totalSpacing
      return {
        ...plane,
        position: [
          (direction > 0 ? newX < boundaries[1] : newX > boundaries[0])
            ? resetX 
            : newX,
          yOffset * MIN_VIEWPORT_SCALE,
          0
        ]
      }
    }))
  })

  return planes.map(plane => (
    <CarouselPlane 
      key={plane.id} 
      {...plane} 
      width={planeWidth} 
      height={planeWidth * (9/16)} 
    />
  ))
}

const ScrollingPlanes = ({ 
  rows = [
    { planeData: [{ id: 1, color: 'red' }, { id: 2, color: 'blue' }], direction: 1, yOffset: 0 }
  ],
  ...props 
}) => {
  return (
    <group>
      {rows.map((row, i) => (
        <ScrollingRow key={i} {...row} {...props} />
      ))}
    </group>
  )
}

export default ScrollingPlanes