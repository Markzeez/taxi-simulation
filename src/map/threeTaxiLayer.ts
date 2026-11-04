import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { MercatorCoordinate } from 'maplibre-gl'
import type {
  CustomLayerInterface,
  CustomRenderMethodInput,
  Map,
} from 'maplibre-gl'

import type { Coordinate } from '../state/types'

type TaxiThreeLayer = CustomLayerInterface & {
  setPosition: (coordinate: Coordinate, bearing: number) => void
}

export function createTaxiThreeLayer(): TaxiThreeLayer {
  const scene = new Scene()
  const camera = new PerspectiveCamera()
  const taxi = new Group()
  const bodyMaterial = new MeshStandardMaterial({ color: '#ffc629', roughness: 0.42, metalness: 0.16 })
  const glassMaterial = new MeshStandardMaterial({
    color: '#23364c',
    roughness: 0.25,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  })
  const trimMaterial = new MeshStandardMaterial({ color: '#202936', roughness: 0.7 })
  const lightMaterial = new MeshStandardMaterial({
    color: '#fff3b0',
    emissive: '#fff3b0',
    emissiveIntensity: 0.6,
  })
  const geometry: BoxGeometry[] = []
  const wheelGeometry = new CylinderGeometry(0.34, 0.34, 0.22, 12)

  const addBox = (
    width: number,
    length: number,
    height: number,
    material: MeshStandardMaterial,
    position: [number, number, number],
  ) => {
    const boxGeometry = new BoxGeometry(width, length, height)
    geometry.push(boxGeometry)
    const mesh = new Mesh(boxGeometry, material)
    mesh.position.set(...position)
    taxi.add(mesh)
  }

  addBox(1.85, 4.2, 0.78, bodyMaterial, [0, 0, 0.78])
  addBox(1.56, 2.15, 0.68, glassMaterial, [0, 0.05, 1.48])
  addBox(0.42, 0.14, 0.15, lightMaterial, [-0.56, -2.12, 0.78])
  addBox(0.42, 0.14, 0.15, lightMaterial, [0.56, -2.12, 0.78])

  for (const x of [-0.96, 0.96]) {
    for (const y of [-1.35, 1.35]) {
      const wheel = new Mesh(wheelGeometry, trimMaterial)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, y, 0.36)
      taxi.add(wheel)
    }
  }

  let map: Map | null = null
  let renderer: WebGLRenderer | null = null

  scene.add(new AmbientLight(0xffffff, 1.8))
  const sunlight = new DirectionalLight(0xffffff, 2.2)
  sunlight.position.set(-20, -35, 60)
  scene.add(sunlight)
  scene.add(taxi)

  const layer: TaxiThreeLayer = {
    id: 'taxi-three-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: (attachedMap, gl) => {
      map = attachedMap
      renderer = new WebGLRenderer({
        canvas: attachedMap.getCanvas(),
        context: gl,
        antialias: true,
      })
      renderer.autoClear = false
    },
    render: (gl, options: CustomRenderMethodInput) => {
      if (!renderer) return

      camera.projectionMatrix.fromArray(options.modelViewProjectionMatrix)
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
      camera.matrixWorld.identity()
      camera.matrixWorldInverse.identity()

      renderer.resetState()
      renderer.setViewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      renderer.render(scene, camera)
    },
    onRemove: () => {
      renderer?.dispose()
      renderer = null
      map = null
      bodyMaterial.dispose()
      glassMaterial.dispose()
      trimMaterial.dispose()
      lightMaterial.dispose()
      wheelGeometry.dispose()
      geometry.forEach((item) => item.dispose())
    },
    setPosition: (coordinate, bearing) => {
      if (!map) return
      const mercator = MercatorCoordinate.fromLngLat({
        lng: coordinate[0],
        lat: coordinate[1],
      })
      const meterScale = mercator.meterInMercatorCoordinateUnits()
      taxi.position.set(mercator.x, mercator.y, mercator.z)
      taxi.scale.setScalar(meterScale)
      taxi.rotation.z = (bearing * Math.PI) / 180
      map.triggerRepaint()
    },
  }

  return layer
}
