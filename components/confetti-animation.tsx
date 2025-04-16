"use client"

import { useEffect, useRef, useState } from "react"

interface ConfettiAnimationProps {
  duration?: number
  onComplete?: () => void
}

export default function ConfettiAnimation({ duration = 3000, onComplete }: ConfettiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(0.1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 꽃가루/색종이 파티클 설정
    const particles: Particle[] = []
    const particleCount = 150
    const colors = ["#ff0000", "#ff9900", "#ffff00", "#33cc33", "#3399ff", "#9966ff", "#ff66ff"]

    class Particle {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = -20 - Math.random() * 100 // 화면 위에서 시작
        this.size = Math.random() * 8 + 5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 3 + 2
        this.rotation = Math.random() * 360
        this.rotationSpeed = Math.random() * 2 - 1
      }

      update(canvas: HTMLCanvasElement) {
        this.y += this.speedY
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5 // 좌우로 흔들리는 효과 추가
        this.rotation += this.rotationSpeed

        // 화면 밖으로 나가면 위로 다시 보내기
        if (this.y > canvas.height) {
          this.y = -20
          this.x = Math.random() * canvas.width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.fillStyle = this.color

        // 사각형 모양만 사용
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)

        ctx.restore()
      }
    }

    // 파티클 생성
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas))
    }

    // 애니메이션 함수
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update(canvas)
        particle.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }

    // 애니메이션 시작
    animate()

    // 지정된 시간 후 애니메이션 종료 및 콜백 실행
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId)
      if (onComplete) onComplete()
    }, duration)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
      clearTimeout(timer)
    }
  }, [duration, onComplete])

  // 텍스트 크기 애니메이션
  useEffect(() => {
    const growInterval = setInterval(() => {
      setScale((prevScale) => {
        const newScale = prevScale * 2
        return newScale > 3 ? 3 : newScale
      })
    }, 100)

    return () => clearInterval(growInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ background: "transparent" }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="text-center font-bold text-pink-600 transition-all duration-300"
          style={{
            transform: `scale(${scale})`,
            fontSize: "min(8vw, 3rem)",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 105, 180, 0.6)",
            opacity: scale < 0.5 ? scale * 2 : 1,
          }}
        >
          축하합니다!
        </div>
      </div>
    </div>
  )
}
