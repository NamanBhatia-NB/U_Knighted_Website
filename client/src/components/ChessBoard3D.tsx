import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useMobile } from '@/hooks/use-mobile';

export default function ChessBoard3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 4;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Create chessboard
    const boardGeometry = new THREE.BoxGeometry(8, 0.2, 8);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(board);
    
    // Create chess squares
    for (let x = -3.5; x <= 3.5; x += 1) {
      for (let z = -3.5; z <= 3.5; z += 1) {
        if ((x + z) % 2 === 0) {
          const squareGeometry = new THREE.BoxGeometry(0.9, 0.21, 0.9);
          const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
          const square = new THREE.Mesh(squareGeometry, squareMaterial);
          square.position.set(x, 0.1, z);
          scene.add(square);
        }
      }
    }
    
    // Create pieces group
    const piecesGroup = new THREE.Group();
    
    // Create kings
    const createKing = (color: number, posX: number, posZ: number) => {
      const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const baseMaterial = new THREE.MeshStandardMaterial({ color: color });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      
      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      
      const topGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const topMaterial = new THREE.MeshStandardMaterial({ color: color });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 0.8;
      
      const crossGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
      const crossMaterial = new THREE.MeshStandardMaterial({ color: color });
      const cross = new THREE.Mesh(crossGeometry, crossMaterial);
      cross.position.y = 1.05;
      
      const crossHGeometry = new THREE.BoxGeometry(0.25, 0.1, 0.1);
      const crossHMaterial = new THREE.MeshStandardMaterial({ color: color });
      const crossH = new THREE.Mesh(crossHGeometry, crossHMaterial);
      crossH.position.y = 1.0;
      
      const kingPiece = new THREE.Group();
      kingPiece.add(base);
      kingPiece.add(body);
      kingPiece.add(top);
      kingPiece.add(cross);
      kingPiece.add(crossH);
      
      kingPiece.position.set(posX, 0.3, posZ);
      return kingPiece;
    };
    
    // Create queens
    const createQueen = (color: number, posX: number, posZ: number) => {
      const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const baseMaterial = new THREE.MeshStandardMaterial({ color: color });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      
      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      
      const topGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const topMaterial = new THREE.MeshStandardMaterial({ color: color });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 0.8;
      
      const queenPiece = new THREE.Group();
      queenPiece.add(base);
      queenPiece.add(body);
      queenPiece.add(top);
      
      queenPiece.position.set(posX, 0.3, posZ);
      return queenPiece;
    };
    
    // Add a few pieces for visual effect
    piecesGroup.add(createKing(0x2B2B2B, -2.5, -2.5));
    piecesGroup.add(createQueen(0x2B2B2B, -1.5, -2.5));
    piecesGroup.add(createKing(0xFFFFFF, 2.5, 2.5));
    piecesGroup.add(createQueen(0xFFFFFF, 1.5, 2.5));
    
    scene.add(piecesGroup);
    
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);
    
    // Create directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate pieces
      piecesGroup.children.forEach((piece, index) => {
        piece.position.y = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.1;
        piece.rotation.y = Date.now() * 0.0005 + index;
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    // Handle container resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    // Set up ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    
    // Also handle window resize events
    window.addEventListener('resize', handleResize);
    
    animate();
    
    // Cleanup function
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      // Dispose of all geometries and materials to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
