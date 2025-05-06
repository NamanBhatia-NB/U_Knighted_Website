import React, { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';

// CSS Chess Board (fallback for Three.js version)
export default function ChessBoard3D() {
  const isMobile = useMobile();
  const [isHovered, setIsHovered] = useState(false);

  // Define pieces and their positions
  const pieces = [
    { type: 'king', color: 'black', position: 'e8' },
    { type: 'queen', color: 'black', position: 'd8' },
    { type: 'rook', color: 'black', position: 'a8' },
    { type: 'rook', color: 'black', position: 'h8' },
    { type: 'knight', color: 'black', position: 'b8' },
    { type: 'knight', color: 'black', position: 'g8' },
    { type: 'bishop', color: 'black', position: 'c8' },
    { type: 'bishop', color: 'black', position: 'f8' },
    { type: 'pawn', color: 'black', position: 'a7' },
    { type: 'pawn', color: 'black', position: 'b7' },
    { type: 'pawn', color: 'black', position: 'c7' },
    { type: 'pawn', color: 'black', position: 'd7' },
    { type: 'pawn', color: 'black', position: 'e7' },
    { type: 'pawn', color: 'black', position: 'f7' },
    { type: 'pawn', color: 'black', position: 'g7' },
    { type: 'pawn', color: 'black', position: 'h7' },
    
    { type: 'king', color: 'white', position: 'e1' },
    { type: 'queen', color: 'white', position: 'd1' },
    { type: 'rook', color: 'white', position: 'a1' },
    { type: 'rook', color: 'white', position: 'h1' },
    { type: 'knight', color: 'white', position: 'b1' },
    { type: 'knight', color: 'white', position: 'g1' },
    { type: 'bishop', color: 'white', position: 'c1' },
    { type: 'bishop', color: 'white', position: 'f1' },
    { type: 'pawn', color: 'white', position: 'a2' },
    { type: 'pawn', color: 'white', position: 'b2' },
    { type: 'pawn', color: 'white', position: 'c2' },
    { type: 'pawn', color: 'white', position: 'd2' },
    { type: 'pawn', color: 'white', position: 'e2' },
    { type: 'pawn', color: 'white', position: 'f2' },
    { type: 'pawn', color: 'white', position: 'g2' },
    { type: 'pawn', color: 'white', position: 'h2' },
  ];

  // Create the board cells (8x8 grid)
  const renderBoard = () => {
    const cells = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    for (let rank = 8; rank >= 1; rank--) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const file = files[fileIndex];
        const position = `${file}${rank}`;
        const isLightSquare = (rank + fileIndex) % 2 === 0;
        
        // Find piece at this position
        const piece = pieces.find(p => p.position === position);
        
        cells.push(
          <div 
            key={position} 
            className={`flex items-center justify-center aspect-square ${isLightSquare ? 'bg-white' : 'bg-secondary'}`}
          >
            {piece && (
              <div 
                className={`text-3xl md:text-xl lg:text-2xl xl:text-3xl cursor-pointer transition-transform duration-300 hover:scale-110`}
                style={{ 
                  color: piece.color === 'white' ? '#fff' : '#000',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {getPieceSymbol(piece.type, piece.color)}
              </div>
            )}
          </div>
        );
      }
    }
    
    return cells;
  };
  
  // Get Unicode chess symbol
  const getPieceSymbol = (type: string, color: string) => {
    const symbols: Record<string, Record<string, string>> = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟︎'
      }
    };
    
    return symbols[color][type];
  };
  
  // CSS styles
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
    width: '100%',
    height: '100%',
    border: '10px solid #8B4513',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    background: '#8B4513',
    transition: 'all 0.7s ease',
    transform: isHovered 
      ? 'perspective(1000px) rotateX(15deg) rotateY(5deg)' 
      : 'perspective(1000px) rotateX(30deg)',
  };
  
  useEffect(() => {
    // Animation frame handler
    let animationFrameId: number;
    
    // Function to animate pieces
    const animatePieces = () => {
      const pieceElements = document.querySelectorAll('.cursor-pointer');
      pieceElements.forEach((piece, index) => {
        if (piece instanceof HTMLElement) {
          piece.style.transform = `translateY(${Math.sin(Date.now() * 0.002 + index) * 5}px)`;
        }
      });
      
      animationFrameId = requestAnimationFrame(animatePieces);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(animatePieces);
    
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-lg aspect-square">
        <div style={boardStyle} className="chess-board">
          {renderBoard()}
        </div>
      </div>
    </div>
  );
}
