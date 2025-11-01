import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const HalloweenGame = () => {
  const mountRef = useRef(null);
  const [candy, setCandy] = useState(0);
  const [message, setMessage] = useState("Use WASD to move, SPACE to knock on doors!");
  const [housesVisited, setHousesVisited] = useState(0);
  const houseCount = 1000;

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0a2e);
    scene.fog = new THREE.Fog(0x1a0a2e, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Moon light
    const moonLight = new THREE.DirectionalLight(0x8888ff, 10);
    moonLight.position.set(10, 20, 10);
    moonLight.castShadow = true;
    scene.add(moonLight);
    scene.add(new THREE.AmbientLight(0x404080, 0.3));

    // Ground
    const groundGeo = new THREE.PlaneGeometry(1000, 1000);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Player (little person)
    const player = new THREE.Group();
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.3;
    head.castShadow = true;
    player.add(head);
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.1, 1.35, 0.25);
    player.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.1, 1.35, 0.25);
    player.add(rightEye);
    
    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.7, 16);
    const costumeMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const body = new THREE.Mesh(bodyGeo, costumeMat);
    body.position.y = 0.7;
    body.castShadow = true;
    player.add(body);
    
    // Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
    const leftArm = new THREE.Mesh(armGeo, costumeMat);
    leftArm.position.set(-0.35, 0.7, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;
    player.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, costumeMat);
    rightArm.position.set(0.35, 0.7, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;
    player.add(rightArm);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.15, 0.15, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.15, 0.15, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);

    player.position.set(0, 0, 0);
    scene.add(player);

    // Create houses
    const houses = [];
    const housePositions = [];
    
    // Generate 100 random house positions
    for (let i = 0; i < houseCount; i++) {
      housePositions.push({
        x: (Math.random() - 0.5) * 360, // Spread across -90 to 90
        z: (Math.random() - 0.5) * 360
      });
    }

    housePositions.forEach((pos, i) => {
      const house = new THREE.Group();
      
      // House body
      const bodyGeo = new THREE.BoxGeometry(4, 3, 4);
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color: i % 3 === 0 ? 0x8b4513 : i % 3 === 1 ? 0x654321 : 0x9b6b3b 
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.5;
      body.castShadow = true;
      house.add(body);

      // Roof
      const roofGeo = new THREE.ConeGeometry(3, 2, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x4a1a1a });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 3.5;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      // Door
      const doorGeo = new THREE.BoxGeometry(1, 2, 0.1);
      const doorMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 1, 2.05);
      house.add(door);

      // Window glow
      const windowGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
      const windowMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0xffaa00,
        emissiveIntensity: 0.5
      });
      const window1 = new THREE.Mesh(windowGeo, windowMat);
      window1.position.set(-1, 2, 2.05);
      house.add(window1);
      const window2 = new THREE.Mesh(windowGeo, windowMat);
      window2.position.set(1, 2, 2.05);
      house.add(window2);

      house.position.set(pos.x, 0, pos.z);
      house.userData = { visited: false, position: pos };
      scene.add(house);
      houses.push(house);
    });

    // Add decorative pumpkins
    for (let i = 0; i < 15; i++) {
      const pumpGeo = new THREE.SphereGeometry(0.3, 8, 8);
      const pumpMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
      const pumpkin = new THREE.Mesh(pumpGeo, pumpMat);
      pumpkin.position.set(
        Math.random() * 40 - 20,
        0.3,
        Math.random() * 40 - 20
      );
      pumpkin.castShadow = true;
      scene.add(pumpkin);
    }

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const keys = {};
    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animate = () => {
      requestAnimationFrame(animate);

      const speed = 0.15;
      const prevPos = player.position.clone();

      if (keys['w']) player.position.z -= speed;
      if (keys['s']) player.position.z += speed;
      if (keys['a']) player.position.x -= speed;
      if (keys['d']) player.position.x += speed;

      // Camera follow
      camera.position.x = player.position.x;
      camera.position.z = player.position.z + 10;
      camera.lookAt(player.position.x, player.position.y, player.position.z);

      // Check if near house
      let nearHouse = null;
      houses.forEach(house => {
        const dist = player.position.distanceTo(new THREE.Vector3(house.position.x, 0, house.position.z));
        if (dist < 4) {
          nearHouse = house;
        }
      });

      if (nearHouse && keys[' ']) {
        if (!nearHouse.userData.visited) {
          const candyAmount = Math.floor(Math.random() * 5) + 1;
          setCandy(c => c + candyAmount);
          setHousesVisited(h => h + 1);
          setMessage(`Got ${candyAmount} candy! 🍬`);
          nearHouse.userData.visited = true;
          
          // Change house color
          nearHouse.children[0].material.color.setHex(0x333333);
          
          setTimeout(() => {
            setMessage(housesVisited + 1 >= houses.length ? 
              "You visited all houses! Happy Halloween! 🎃" :
              "Use WASD to move, SPACE to knock on doors!");
          }, 2000);
        } else {
          setMessage("Already visited this house!");
          setTimeout(() => setMessage("Use WASD to move, SPACE to knock on doors!"), 2000);
        }
        keys[' '] = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '5px' }}>🍬 Candy: {candy}</div>
        <div>🏠 Houses: {housesVisited}/{houseCount}</div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,100,0,0.9)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        textAlign: 'center'
      }}>
        {message}
      </div>
    </div>
  );
};

export default HalloweenGame;