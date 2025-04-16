"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Download, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import ConfettiAnimation from "./confetti-animation"
import html2canvas from "html2canvas"

// 설문 질문 데이터 (하드코딩용 예시)
const surveyQuestions = [
  {
    id: 1,
    question: "💭 1. 새로운 루틴을 시작할 때 나는…",
    options: ["A. 계획부터 완벽히 세운다", "B. 일단 시작하고 본다", "C. 친구가 하자고 해야 시작한다"],
  },
  {
    id: 2,
    question: "⏰ 2. 하루 중 루틴 실천 시간을 정할 때는?",
    options: ["A. 구체적으로 시간을 정해두는 편이다", "B. ‘그때 여유 있으면 하지 뭐’", "C. 아예 하루 중에 끼워넣을 생각을 안 한다"],
  },
  {
    id: 3,
    question: "🧨 3. 루틴을 실패했을 때 가장 먼저 드는 생각은?",
    options: [
      "A. 또 실패야… 나 진짜 왜 이럴까",
      "B. 뭐, 내일 하면 되지",
      "C. 그냥 잊고 넘어간다",
    ],
  },
  {
    id: 4,
    question: "🧠 4. 내가 정한 목표는 실제로…",
    options: [
      "A. 현실적이고 가능한 편이다",
      "B. 약간 무리지만 해볼 만하다",
      "C. 지나고 보면 나도 왜 저렇게 세웠는지 모르겠다",
    ],
  },
  {
    id: 5,
    question: "🌪 5. 주변 환경이 루틴 유지에…",
    options: [
      "A. 크게 영향을 준다 (바쁘면 바로 무너짐)",
      "B. 조금 영향을 받는 편이다",
      "C. 딱히 상관 없다 (나 자신 문제다)",
    ],
  },
  {
    id: 6,
    question: "🎯 6. 루틴을 지키는 가장 큰 이유는?",
    options: [
      "A. 나 자신과의 약속이니까",
      "B. 성과나 결과가 눈에 보여야 하니까",
      "C. 누군가에게 보여줘야 하니까",
    ],
  },
  {
    id: 7,
    question: "🧩 7. 루틴을 만들 때 가장 어려운 건?",
    options: [
      "A. 시작하기",
      "B. 유지하기",
      "C. 재미를 붙이기",
    ],
  },
  {
    id: 8,
    question: "🕹 8. 루틴을 지키기 위해 어떤 도구를 써봤나?",
    options: [
      "A. 앱이나 플래너, 캘린더 등",
      "B. 메모장이나 입으로 다짐",
      "C. 그런 거 안 써봤다",
    ],
  },
  {
    id: 9,
    question: "🧍 9. 나는 루틴을 할 때 혼자 하는 게…",
    options: [
      "A. 편하다",
      "B. 조금 지루하다",
      "C. 금방 포기하게 된다",
    ],
  },
  {
    id: 10,
    question: "🔄 10. 내가 루틴을 반복하는 이유는…",
    options: [
      "A. 지금의 나를 바꾸고 싶어서",
      "B. 뭔가를 이루고 싶은 목표가 있어서",
      "C. 그냥 요즘 사람들이 다 하길래 나도",
    ],
  },
  {
    id: 11,
    question: "🍌 만약 갑자기 아침에 일어났는데 퉁퉁퉁퉁 사후르가 되어있었다면?",
    image: "/tungtung.png?height=50&width=100",
    options: ["A. 거울을 보면서 ‘와 퉁퉁퉁퉁 사후르다' 감탄한다", "B. ‘방망이를 휘둘러볼까?’ 고민한다.", "C. ‘이건 꿈이야..!’ 다시 잠든다."],
  },
]

// Define interface for result data
interface SurveyResultData {
  imageSrc: string;
  imageAlt: string;
  character: string;
  diagnosisTitle: string;
  diagnosis: string;
  recommendations: string[];
}

// Create result data array
const allResultsData: SurveyResultData[] = [
  {
    imageSrc: "/tungtung.png",
    character: "퉁퉁퉁퉁 사후르",
    imageAlt: "결과 이미지",
    diagnosisTitle: "급성 작심삼일증",
    diagnosis: "Acute Determination-3days Syndrome",
    recommendations: [
      "루틴 시작 전에 심호흡 3회 실시",
      "작심삼일 이후에도 ‘작심사일’을 시도해 볼 것",
      "가능한 한 주변인에게 공표하여 감시 체계 구축 요망",
    ],
  },
  {
    imageSrc: "/bomb.webp",
    character: "봄바르디로 크로코딜로",
    imageAlt: "루틴 회피 이미지",
    diagnosisTitle: "만성 루틴 회피증",
    diagnosis: "Chronic Routine Avoidance Disorder",
    recommendations: [
      "루틴을 '의무'가 아닌 '루틴 놀이'로 생각해보기",
      "일단 1분만 해보기 전략을 시도해 볼 것",
      "루틴이 떠오르면 갑자기 방 청소하는 습관은 경계 요망",
    ],
  },
  {
    imageSrc: "/tralral.webp",
    character: "트랄랄레로 트랄랄라",
    imageAlt: "과잉계획 이미지",
    diagnosisTitle: "과잉계획장애",
    diagnosis: "Overplanning Mania Syndrome",
    recommendations: [
      "루틴 개수 3개 이하로 제한 요망",
      "색깔 많은 플래너에 집착하지 말 것",
      "루틴 실행보다 계획 세우는 게 더 재밌다는 사실을 인지할 것",
    ],
  },
  {
    imageSrc: "/liril.webp",
    character: "리릴리 라릴라",
    imageAlt: "다짐 과다 이미지",
    diagnosisTitle: "루틴 다짐 과다복용증",
    diagnosis: "Routine Overpromise Addiction",
    recommendations: [
      "SNS에서 '이제 진짜 시작' 글 작성 빈도 월 1회 이하로 제한",
      "시작하기 전에 '한 번 해보고 말하지 뭐' 마인드 적용",
      "매 루틴에 대해 다짐보다 실행 스샷 저장 권장",
    ],
  },
  {
    imageSrc: "/brrbrr.webp",
    character: "브르르 브르르 파타핌",
    imageAlt: "기상 직후 멍한 상태",
    diagnosisTitle: "기상 후 뇌 정지 증후군",
    diagnosis: "Post-Wakeup Cognitive Suspension Disorder",
    recommendations: [
      "눈 뜨자마자 핸드폰 금지 (특히 Shorts, Reels)",
      "기상 후 5분간 ‘무의미한 산책’ 추천",
      "침대 근처에 커피 향 나는 무언가 배치 필요",
    ],
  },
  {
    imageSrc: "/chimpan.webp",
    character: "침판지니 바나니니",
    imageAlt: "SNS 딥다이브",
    diagnosisTitle: "루틴 시작 전 SNS 딥다이브병",
    diagnosis: "Pre-Routine Social Media Immersion Disorder",
    recommendations: [
      "루틴 앱 바로 옆에 유튜브 배치하지 말 것",
      "SNS 알림 OFF, 앱 위치는 폴더 속 폴더로 격리 권장",
      "SNS 10분이면 된다는 생각은 환각 증상임",
    ],
  },
  {
    imageSrc: "/cafu.webp",
    character: "카푸치노 아사시노",
    imageAlt: "보상만 기다리는 루틴형 게이머",
    diagnosisTitle: "보상만 찾는 루틴형 게이머증",
    diagnosis: "Routine Gamification Dependence",
    recommendations: [
      "체크리스트에 스티커 붙이는 걸로 충분한 보상 인식 훈련 필요",
      "보상이 없으면 시작도 안 하는 태도 교정 요망",
      "루틴 자체가 보상이라는 마인드 장착 훈련 필요",
    ],
  }
];

export default function SurveyForm() {
  const [nickname, setNickname] = useState("")
  const [showNicknameInput, setShowNicknameInput] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SurveyResultData | null>(null);
  const resultCardRef = useRef<HTMLDivElement>(null)

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setShowNicknameInput(false)
    }
  }

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion + 1]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // 마지막 질문 후 꽃가루 효과 표시
      setShowConfetti(true)

      // 진동 효과 (지원하는 기기에서만)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
    setShowResults(true)
    // Select a random result when confetti finishes
    const randomIndex = Math.floor(Math.random() * allResultsData.length);
    setSelectedResult(allResultsData[randomIndex]);
  }

  // 결과 이미지로 저장하기
  const saveResultAsImage = async () => {
    if (!resultCardRef.current) return

    try {
      // 결과 카드를 이미지로 변환
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // 고해상도
        logging: false,
        useCORS: true,
      })

      // 이미지 다운로드
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `jakbu-${nickname}-result.png`
      link.click()
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error)
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  // 공유하기 (모바일 기기에서 지원되는 경우)
  const shareResult = async () => {
    if (!resultCardRef.current) return

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      })

      // 캔버스를 Blob으로 변환
      canvas.toBlob(async (blob) => {
        if (!blob) return

        // 공유 API가 지원되는지 확인
        if (navigator.share) {
          try {
            const file = new File([blob], `jakbu-${nickname}-result.png`, { type: "image/png" })
            await navigator.share({
              title: "Jakbu 설문 결과",
              text: `${nickname}님의 설문조사 결과를 확인해보세요!`,
              files: [file],
            })
          } catch (error) {
            console.error("공유 중 오류 발생:", error)
            // 공유 취소 시 조용히 실패
          }
        } else {
          // 공유 API를 지원하지 않는 경우 다운로드로 대체
          saveResultAsImage()
        }
      }, "image/png")
    } catch (error) {
      console.error("이미지 생성 중 오류 발생:", error)
    }
  }

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100

  // 닉네임 입력 화면
  if (showNicknameInput) {
    return (
      <Card className="mx-auto max-w-md border-pink-200 shadow-lg bg-white">
        <CardContent className="p-6 text-center">
          <h2 className="mb-6 text-2xl font-bold text-pink-600">설문을 시작하기 전에</h2>
          <p className="mb-6 text-gray-600">닉네임을 입력해주세요</p>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border-pink-200 text-center text-black bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && nickname.trim()) {
                  handleNicknameSubmit()
                }
              }}
            />
          </div>

          <Button
            onClick={handleNicknameSubmit}
            disabled={!nickname.trim()}
            className="w-full bg-pink-500 py-6 text-lg hover:bg-pink-600 text-white"
          >
            설문 시작하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 꽃가루 효과
  if (showConfetti) {
    return <ConfettiAnimation duration={4000} onComplete={handleConfettiComplete} />
  }

  // 결과 화면
  if (showResults && selectedResult) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="border-pink-200 bg-pink-50 shadow-lg" ref={resultCardRef}>
          <CardContent className="p-6 text-center">
            <div className="mb-4 bg-pink-500 p-3 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold">{nickname}님의 설문 결과</h2>
            </div>

            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={`${selectedResult.imageSrc}?height=300&width=250`}
                alt={selectedResult.imageAlt}
                className="mx-auto h-[300px] w-[250px] object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div className="rounded-lg bg-pink-100 p-4 text-left">
              <h3 className="mb-2 text-lg font-semibold text-pink-700">결과 분석</h3>
              <p className="text-gray-700">
                {nickname}님과 닮은 캐릭터: {selectedResult.character} <br />
                <br />
                성함: {nickname} <br />
                진단명: {selectedResult.diagnosisTitle} ({selectedResult.diagnosis}) <br />
                권고사항:
                <br />
                {selectedResult.recommendations.map((rec, index) => (
                  <span key={index}>- {rec}<br /></span>
                ))}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button
            className="flex items-center justify-center gap-2 bg-pink-500 py-5 text-base hover:bg-pink-600 text-white"
            onClick={saveResultAsImage}
          >
            <Download className="h-5 w-5" />
            저장하기
          </Button>
          <Button
            className="flex items-center justify-center gap-2 bg-pink-500 py-5 text-base hover:bg-pink-600 text-white"
            onClick={shareResult}
          >
            <Share2 className="h-5 w-5" />
            공유하기
          </Button>
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full border-pink-200 py-5 text-base text-pink-600 bg-white hover:bg-pink-50 hover:text-black"
          onClick={() => {
            setCurrentQuestion(0)
            setAnswers({})
            setCompleted(false)
            setShowResults(false)
            setShowNicknameInput(true)
          }}
        >
          다시 시작하기
        </Button>
      </div>
    )
  }

  // If showing results but no result is selected yet (e.g., during random selection)
  if (showResults && !selectedResult) {
    return <div>결과를 불러오는 중...</div>;
  }

  const question = surveyQuestions[currentQuestion]

  return (
    <Card className="mx-auto max-w-md border-pink-200 shadow-lg bg-white">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              질문 {currentQuestion + 1}/{surveyQuestions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-pink-100" />
        </div>

        <h2 className="mb-4 text-xl font-semibold text-gray-800">{question.question}</h2>

        {/* 11번째 질문에 이미지 추가 */}
        {"image" in question && question.image && (
          <div className="mb-6 overflow-hidden rounded-lg">
            <img
              src={question.image || "/placeholder.svg"}
              alt="질문 이미지"
              className="mx-auto w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}

        <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer} className="mb-8 space-y-4">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center bg-white rounded-lg border border-pink-100 p-5 transition-colors cursor-pointer",
                answers[question.id] === option ? "bg-pink-50 border-pink-300" : "hover:bg-pink-50",
              )}
              onClick={() => handleAnswer(option)}
            >
              <RadioGroupItem value={option} id={`option-${index}`} className="border-pink-300 text-pink-500" />
              <Label htmlFor={`option-${index}`} className="ml-4 text-base font-medium text-gray-700 flex-1">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 border-pink-200 py-6 text-lg text-pink-600 hover:bg-pink-50 hover:text-pink-700 bg-white"
          >
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="flex-1 bg-pink-500 py-6 text-lg hover:bg-pink-600 text-white"
          >
            {currentQuestion === surveyQuestions.length - 1 ? "제출하기" : "다음"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
