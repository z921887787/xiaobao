import * as THREE from 'three';

export class MarkerSystem {
  constructor(scene, camera, canvas) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.markers = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredMarker = null;
    this.onMarkerClick = null;

    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.canvas.addEventListener('pointermove', e => this._onPointerMove(e));
    this.canvas.addEventListener('click', e => this._onClick(e));
  }

  addMarkers(markerDataList) {
    for (const data of markerDataList) {
      const position = this._latLngToVector3(data.lat, data.lng, 1.01);

      // Visible dot
      const dotGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xff6d89,
        transparent: true,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(position);
      this.scene.add(dot);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.02, 0.035, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff98b3,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(position);
      ring.lookAt(position.clone().multiplyScalar(2));
      this.scene.add(ring);

      // Invisible hit sphere for easier clicking
      const hitGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.position.copy(position);
      this.scene.add(hitSphere);

      this.markers.push({
        data,
        position,
        dot,
        ring,
        hitSphere,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  update(time) {
    const camDir = this.camera.position.clone().normalize();

    for (const marker of this.markers) {
      // Backface hiding
      const dotProduct = marker.position.clone().normalize().dot(camDir);
      const visible = dotProduct > -0.1;
      marker.dot.visible = visible;
      marker.ring.visible = visible;
      marker.hitSphere.visible = visible;

      if (!visible) continue;

      // Fade based on viewing angle
      const opacity = THREE.MathUtils.smoothstep(dotProduct, -0.1, 0.2);
      marker.dot.material.opacity = opacity;
      marker.ring.material.opacity = opacity * 0.8;

      // Pulse animation
      if (!this._reducedMotion) {
        const pulse = Math.sin(time * 2 + marker.pulsePhase) * 0.5 + 0.5;
        const scale = 1 + pulse * 0.6;
        marker.ring.scale.set(scale, scale, scale);
        marker.ring.material.opacity = opacity * (0.8 - pulse * 0.6);
      }
    }
  }

  _latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  _getPointerCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hitSpheres = this.markers
      .filter(m => m.hitSphere.visible)
      .map(m => m.hitSphere);
    const intersects = this.raycaster.intersectObjects(hitSpheres);
    if (intersects.length > 0) {
      return this.markers.find(m => m.hitSphere === intersects[0].object);
    }
    return null;
  }

  _onPointerMove(event) {
    this._getPointerCoords(event);
    const hit = this._raycast();
    if (hit !== this.hoveredMarker) {
      this.hoveredMarker = hit;
      this.canvas.style.cursor = hit ? 'pointer' : 'grab';
    }
  }

  _onClick(event) {
    this._getPointerCoords(event);
    const hit = this._raycast();
    if (hit && this.onMarkerClick) {
      this.onMarkerClick(hit.data);
    }
  }
}
