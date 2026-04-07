import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COUNTRIES_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/** 国家名称标注（居中显示，较大字号） */
const COUNTRY_LABELS = [
  { name: '中国', lat: 36, lng: 100 },
  { name: '蒙古', lat: 47, lng: 104 },
  { name: '俄罗斯', lat: 62, lng: 90 },
  { name: '印度', lat: 22, lng: 80 },
  { name: '哈萨克斯坦', lat: 48, lng: 67 },
  { name: '沙特阿拉伯', lat: 24, lng: 44 },
  { name: '伊朗', lat: 33, lng: 53 },
  { name: '印度尼西亚', lat: -4, lng: 118 },
  { name: '泰国', lat: 15, lng: 101 },
  { name: '缅甸', lat: 20, lng: 96 },
  { name: '日本', lat: 37, lng: 138 },
  { name: '菲律宾', lat: 12, lng: 122 },
  { name: '英国', lat: 55, lng: -2 },
  { name: '法国', lat: 47, lng: 3 },
  { name: '德国', lat: 51, lng: 10 },
  { name: '西班牙', lat: 40, lng: -4 },
  { name: '意大利', lat: 43, lng: 12 },
  { name: '波兰', lat: 52, lng: 20 },
  { name: '乌克兰', lat: 49, lng: 32 },
  { name: '瑞典', lat: 63, lng: 16 },
  { name: '挪威', lat: 65, lng: 10 },
  { name: '芬兰', lat: 64, lng: 26 },
  { name: '土耳其', lat: 39, lng: 35 },
  { name: '美国', lat: 40, lng: -100 },
  { name: '加拿大', lat: 58, lng: -100 },
  { name: '墨西哥', lat: 24, lng: -103 },
  { name: '巴西', lat: -10, lng: -52 },
  { name: '阿根廷', lat: -35, lng: -64 },
  { name: '哥伦比亚', lat: 4, lng: -73 },
  { name: '秘鲁', lat: -10, lng: -76 },
  { name: '智利', lat: -33, lng: -71 },
  { name: '格陵兰', lat: 72, lng: -42 },
  { name: '埃及', lat: 27, lng: 30 },
  { name: '利比亚', lat: 27, lng: 17 },
  { name: '阿尔及利亚', lat: 28, lng: 2 },
  { name: '苏丹', lat: 16, lng: 30 },
  { name: '尼日利亚', lat: 10, lng: 8 },
  { name: '刚果(金)', lat: -3, lng: 23 },
  { name: '南非', lat: -30, lng: 25 },
  { name: '澳大利亚', lat: -25, lng: 134 },
  { name: '新西兰', lat: -42, lng: 174 },
];

/** 主要城市标注（圆点 + 右侧文字） */
const CITY_LABELS = [
  { name: '北京', lat: 39.90, lng: 116.40 },
  { name: '上海', lat: 31.23, lng: 121.47 },
  { name: '广州', lat: 23.13, lng: 113.26 },
  { name: '成都', lat: 30.57, lng: 104.07 },
  { name: '东京', lat: 35.68, lng: 139.69 },
  { name: '首尔', lat: 37.57, lng: 126.98 },
  { name: '新加坡', lat: 1.35, lng: 103.82 },
  { name: '曼谷', lat: 13.76, lng: 100.50 },
  { name: '河内', lat: 21.03, lng: 105.85 },
  { name: '雅加达', lat: -6.21, lng: 106.85 },
  { name: '新德里', lat: 28.61, lng: 77.21 },
  { name: '孟买', lat: 19.08, lng: 72.88 },
  { name: '迪拜', lat: 25.20, lng: 55.27 },
  { name: '伊斯坦布尔', lat: 41.01, lng: 28.98 },
  { name: '伦敦', lat: 51.51, lng: -0.13 },
  { name: '巴黎', lat: 48.86, lng: 2.35 },
  { name: '柏林', lat: 52.52, lng: 13.41 },
  { name: '罗马', lat: 41.90, lng: 12.50 },
  { name: '马德里', lat: 40.42, lng: -3.70 },
  { name: '莫斯科', lat: 55.76, lng: 37.62 },
  { name: '纽约', lat: 40.71, lng: -74.01 },
  { name: '洛杉矶', lat: 34.05, lng: -118.24 },
  { name: '芝加哥', lat: 41.88, lng: -87.63 },
  { name: '多伦多', lat: 43.65, lng: -79.38 },
  { name: '墨西哥城', lat: 19.43, lng: -99.13 },
  { name: '圣保罗', lat: -23.55, lng: -46.63 },
  { name: '布宜诺斯艾利斯', lat: -34.60, lng: -58.38 },
  { name: '利马', lat: -12.05, lng: -77.04 },
  { name: '开罗', lat: 30.04, lng: 31.24 },
  { name: '拉各斯', lat: 6.52, lng: 3.38 },
  { name: '内罗毕', lat: -1.29, lng: 36.82 },
  { name: '开普敦', lat: -33.93, lng: 18.42 },
  { name: '悉尼', lat: -33.87, lng: 151.21 },
  { name: '墨尔本', lat: -37.81, lng: 144.96 },
  { name: '奥克兰', lat: -36.85, lng: 174.76 },
];

export class GlobeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.dirty = true;
    this.autoRotate = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.autoRotate = false;
    }

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initControls();
    this._createAtmosphere();
    this._onResize();

    window.addEventListener('resize', () => this._onResize());
  }

  /** Fetch Natural Earth data and build the earth mesh. */
  async init() {
    let countriesGeo = null;
    let bordersGeo = null;
    let coastlineGeo = null;
    try {
      const topojson = await import('topojson-client');
      const resp = await fetch(COUNTRIES_TOPO_URL);
      const topo = await resp.json();
      countriesGeo = topojson.feature(topo, topo.objects.countries);
      bordersGeo = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
      coastlineGeo = topojson.mesh(topo, topo.objects.countries, (a, b) => a === b);
    } catch (err) {
      console.warn('Failed to load map data:', err);
    }

    const geo = new THREE.SphereGeometry(1, 64, 64);
    const texture = this._createEarthTexture(countriesGeo, bordersGeo, coastlineGeo);
    texture.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    this.earth = new THREE.Mesh(geo, mat);
    this.scene.add(this.earth);
    this.dirty = true;
  }

  /* ---- private setup ---- */

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xfff0f0, 0.6);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);
  }

  _initCamera() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 3);
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 5;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.addEventListener('change', () => { this.dirty = true; });
  }

  /* ---- texture generation ---- */

  _createEarthTexture(countriesGeo, bordersGeo, coastlineGeo) {
    const w = 2048;
    const h = 1024;
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext('2d');

    // Ocean
    ctx.fillStyle = '#fef0f5';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 152, 179, 0.10)';
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = (90 - lat) / 180 * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = (lng + 180) / 360 * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Equator (slightly more visible)
    ctx.strokeStyle = 'rgba(255, 152, 179, 0.22)';
    ctx.lineWidth = 1.5;
    const eqY = 0.5 * h;
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(w, eqY);
    ctx.stroke();

    // 1. Fill land areas
    if (countriesGeo) {
      ctx.fillStyle = 'rgba(255, 200, 215, 0.45)';
      this._drawGeoJSON(ctx, countriesGeo, w, h, true, false);
    }

    // 2. Coastlines (thicker)
    if (coastlineGeo) {
      ctx.strokeStyle = 'rgba(255, 109, 137, 0.65)';
      ctx.lineWidth = 2;
      this._drawLines(ctx, coastlineGeo, w, h);
    }

    // 3. Country borders (thinner, lighter)
    if (bordersGeo) {
      ctx.strokeStyle = 'rgba(200, 100, 130, 0.35)';
      ctx.lineWidth = 1;
      this._drawLines(ctx, bordersGeo, w, h);
    }

    // 4. Country name labels
    this._drawCountryLabels(ctx, w, h);

    // 5. City labels with dots
    this._drawCityLabels(ctx, w, h);

    return new THREE.CanvasTexture(cvs);
  }

  /** Draw Polygon / MultiPolygon features. */
  _drawGeoJSON(ctx, geoJSON, w, h, fill = true, stroke = true) {
    const toX = lng => (lng + 180) / 360 * w;
    const toY = lat => (90 - lat) / 180 * h;

    const drawRing = (ring) => {
      for (let i = 0; i < ring.length; i++) {
        const x = toX(ring[i][0]);
        const y = toY(ring[i][1]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawPolygon = (rings) => {
      ctx.beginPath();
      for (const ring of rings) drawRing(ring);
      if (fill) ctx.fill('evenodd');
      if (stroke) ctx.stroke();
    };

    const features = geoJSON.type === 'FeatureCollection'
      ? geoJSON.features
      : [geoJSON.type === 'Feature' ? geoJSON : { geometry: geoJSON }];

    for (const feat of features) {
      const geom = feat.geometry || feat;
      if (geom.type === 'Polygon') {
        drawPolygon(geom.coordinates);
      } else if (geom.type === 'MultiPolygon') {
        for (const p of geom.coordinates) drawPolygon(p);
      }
    }
  }

  /** Draw MultiLineString / LineString (borders, coastlines). */
  _drawLines(ctx, geo, w, h) {
    const toX = lng => (lng + 180) / 360 * w;
    const toY = lat => (90 - lat) / 180 * h;
    const lines = geo.type === 'MultiLineString'
      ? geo.coordinates
      : geo.type === 'LineString' ? [geo.coordinates] : [];
    for (const line of lines) {
      ctx.beginPath();
      for (let i = 0; i < line.length; i++) {
        const x = toX(line[i][0]);
        const y = toY(line[i][1]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  /** Draw country name labels (centered, semi-transparent). */
  _drawCountryLabels(ctx, w, h) {
    const toX = lng => (lng + 180) / 360 * w;
    const toY = lat => (90 - lat) / 180 * h;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 24px "Microsoft YaHei", "Source Han Sans", "Noto Sans SC", sans-serif';

    for (const c of COUNTRY_LABELS) {
      const x = toX(c.lng);
      const y = toY(c.lat);
      // White outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.strokeText(c.name, x, y);
      // Fill
      ctx.fillStyle = 'rgba(150, 80, 100, 0.55)';
      ctx.fillText(c.name, x, y);
    }
  }

  /** Draw city labels (dot + name). */
  _drawCityLabels(ctx, w, h) {
    const toX = lng => (lng + 180) / 360 * w;
    const toY = lat => (90 - lat) / 180 * h;

    ctx.font = '500 16px "Microsoft YaHei", "Source Han Sans", "Noto Sans SC", sans-serif';

    for (const c of CITY_LABELS) {
      const x = toX(c.lng);
      const y = toY(c.lat);

      // City dot
      ctx.fillStyle = 'rgba(255, 80, 120, 0.85)';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Label with outline
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.strokeText(c.name, x + 6, y);
      ctx.fillStyle = 'rgba(90, 45, 60, 0.9)';
      ctx.fillText(c.name, x + 6, y);
    }
  }

  /* ---- atmosphere ---- */

  _createAtmosphere() {
    const geo = new THREE.SphereGeometry(1.04, 64, 64);
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - dot(viewDir, vNormal);
          fresnel = pow(fresnel, 3.0);
          gl_FragColor = vec4(1.0, 0.596, 0.702, fresnel * 0.5);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(geo, mat);
    this.scene.add(this.atmosphere);
  }

  /* ---- public API ---- */

  _onResize() {
    const container = this.canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  setAutoRotate(enabled) {
    this.autoRotate = enabled;
    this.controls.autoRotate = enabled;
    this.dirty = true;
  }

  zoomIn() {
    const dist = this.camera.position.length();
    const target = Math.max(this.controls.minDistance, dist - 0.3);
    this.camera.position.setLength(target);
    this.dirty = true;
  }

  zoomOut() {
    const dist = this.camera.position.length();
    const target = Math.min(this.controls.maxDistance, dist + 0.3);
    this.camera.position.setLength(target);
    this.dirty = true;
  }

  update() {
    this.controls.update();
    if (this.controls.autoRotate) this.dirty = true;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.dirty = false;
  }
}
