import { MessageForm } from "./message-form"
import { MessageList } from "./message-list"

export default async function MuralPage() {

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-pink-800 text-center mb-10">Mural de Mensagens para Piettra</h1>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">Deixe sua mensagem</h2>
          <MessageForm />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-pink-700 mb-6">Mensagens dos Convidados</h2>
          <MessageList />
        </div>
      </div>
    </main>
  )
}
