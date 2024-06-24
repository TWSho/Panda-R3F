import React, { useState } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import Light from './Light'; // Lightコンポーネントをインポート
import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';

export default function App() {
  const [boxPosition, setBoxPosition] = useState([0, 0, 0]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const threshold = 50; // スワイプと判断するための最小距離
  
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

  const handleTouchEnd = () => {
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
      onMouseUp={handleTouchEnd}
    >
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
        <Light />
        <Box position={boxPosition} />
      </Canvas>
    </div>
  );
}

// Boxコンポーネント
function Box({ position }) {
  const { pos } = useSpring({
    pos: position,
    config: { tension: 500, friction: 30 }, // アニメーションの設定
  });

  return (
    <animated.mesh position={pos}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </animated.mesh>
  );
}