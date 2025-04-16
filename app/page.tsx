import SurveyForm from "@/components/survey-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/jakbu.png?height=300&width=300" alt="Jakbu 로고" className="h-12 w-14" />
          </div>
          <h1 className="text-4xl font-bold text-pink-600">Jakbu</h1>
        </header>
        <SurveyForm />
      </div>
    </main>
  )
}
