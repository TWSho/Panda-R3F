import React, { useState } from 'react';
import './App.css';
import { Canvas, useLoader  } from '@react-three/fiber';
import { OrthographicCamera ,Text } from '@react-three/drei';
import Light from './Light'; // Lightコンポーネントをインポート
import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader } from 'three';





export default function App() {
  const [boxPosition, setBoxPosition] = useState([0, 0, 0]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const threshold = 50; // スワイプと判断するための最小距離

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleStart = (clientX, clientY) => {
    touchStartX.current = clientX;
    touchStartY.current = clientY;
  };

  const handleMove = (clientX, clientY) => {
    touchEndX.current = clientX;
    touchEndY.current = clientY;
  };


  const handleMouseStart = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleEnd = () => {
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      // スワイプと見なさない
      console.log('Click detected');
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        console.log('Swiped right');
        setBoxPosition(prevPosition => [prevPosition[0] + 1, prevPosition[1], prevPosition[2]]);
      } else {
        console.log('Swiped left');
        setBoxPosition(prevPosition => [prevPosition[0] - 1, prevPosition[1], prevPosition[2]]);
      }
    } else {
      if (deltaY > 0) {
        console.log('Swiped down');
        setBoxPosition(prevPosition => [prevPosition[0], prevPosition[1] - 1, prevPosition[2]]);
      } else {
        console.log('Swiped up');
        setBoxPosition(prevPosition => [prevPosition[0], prevPosition[1] + 1, prevPosition[2]]);
      }
    }
  };

  return (
    <div
      className="App"
      onMouseDown={handleMouseStart}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      style={{ touchAction: 'none', width: '100vw', height: '100vh' }} // タッチアクションを無効化
    >
      <h1>Panda-R3F</h1>
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
        <Light />
        <Tips />
        <Box position={boxPosition} />
      </Canvas>
    </div>
  );
}

// Boxコンポーネント
function Box({ position }) {
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/favicon.ico`);
  const { pos } = useSpring({
    pos: position,
    config: { tension: 500, friction: 30 }, // アニメーションの設定
  });

  return (
    <animated.mesh position={pos}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </animated.mesh>
  );
}
// Boxコンポーネント
function Tips() {
  return (
    <Text 
    position={[0, 3, 0]} 
    fontSize={0.5} 
    color="white"
  >
    画面をフリックしてみよう！
  </Text>
  );
}