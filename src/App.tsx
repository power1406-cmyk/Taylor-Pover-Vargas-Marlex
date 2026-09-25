/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Building2, BookOpenText, Target, ShieldCheck, Users, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import reglamentoData from './reglamento.json';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const modules = [
  { id: 1, title: 'Día 1: Empresa y SENA', icon: Building2, color: 'bg-blue-500', description: 'Analiza la historia del SENA y el entorno empresarial.' },
  { id: 2, title: 'Día 2: Modelo y Procesos', icon: BookOpenText, color: 'bg-green-500', description: 'Aplica el modelo pedagógico y herramientas administrativas.' },
  { id: 3, title: 'Día 3: Perfil Profesional', icon: Target, color: 'bg-yellow-500', description: 'Caracteriza tus competencias y proyecta tu visión en gestión.' },
  { id: 4, title: 'Día 4: Normativa Laboral', icon: ShieldCheck, color: 'bg-red-500', description: 'Analiza el reglamento y aplica normas de seguridad empresarial.' },
  { id: 5, title: 'Día 5: Proyección Profesional', icon: Users, color: 'bg-purple-500', description: 'Resume las oportunidades en APE y planifica la etapa productiva.' },
];

function ReglamentoQuiz({ aprendiz }: { aprendiz: { nombre: string, documento: string } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'positive' | 'negative' | null, message: string }>({ type: null, message: '' });
  const question = reglamentoData.quiz[currentIndex];

  const handleAnswer = async (index: number) => {
    const isCorrect = index === question.respuestaCorrecta;
    
    // Guardar respuesta en Firestore
    try {
      await addDoc(collection(db, 'resultados_evaluacion'), {
        aprendiz,
        pregunta: question.pregunta,
        respuestaSeleccionada: question.opciones[index],
        esCorrecta: isCorrect,
        fecha: new Date()
      });
    } catch (e) {
      console.error("Error guardando resultado: ", e);
    }

    if (isCorrect) {
      setFeedback({ type: 'positive', message: '¡Excelente! Respuesta correcta.' });
    } else {
      setFeedback({ type: 'negative', message: `Incorrecto. ${question.explicacion}` });
    }
  };
// ... rest of the component

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-bold text-lg mb-4">Prueba de Conocimientos: Derechos y Deberes</h4>
      <div className="mb-4">
        <p className="font-medium text-lg mb-3">{question.pregunta}</p>
        <div className="grid gap-2">
          {question.opciones.map((op, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 text-left transition">
              {op}
            </button>
          ))}
        </div>
      </div>
      {feedback.type && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${feedback.type === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.type === 'positive' ? <CheckCircle2 /> : <XCircle />}
          <p>{feedback.message}</p>
          {feedback.type === 'negative' && (
             <button onClick={() => setFeedback({ type: null, message: '' })} className="ml-auto underline">Cerrar</button>
          )}
          {feedback.type === 'positive' && currentIndex < reglamentoData.quiz.length - 1 && (
            <button onClick={() => { setCurrentIndex(currentIndex + 1); setFeedback({ type: null, message: '' }); }} className="ml-auto bg-green-600 text-white px-4 py-1 rounded">Siguiente</button>
          )}
        </div>
      )}
    </div>
  );
}

const moduleContents: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-4">
      <p>Bienvenido al programa de <strong>Gestión Empresarial</strong>. <strong>Analiza</strong> el papel del SENA como aliado estratégico en el ecosistema empresarial.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Enfoque:</strong> <strong>Relaciona</strong> la misión del SENA con la competitividad empresarial.</li>
        <li><strong>Símbolos:</strong> <strong>Identifica</strong> los símbolos institucionales aplicados al sector comercio y servicios (Caduceo).</li>
      </ul>
    </div>
  ),
  2: <div><strong>Aplica</strong> herramientas de gestión administrativa, gestiona proyectos y <strong>navega</strong> en plataformas (SOFIA Plus, Territorium).</div>,
  3: <div><strong>Caracteriza</strong> tus competencias laborales y <strong>diseña</strong> tu proyecto de vida enfocado en el liderazgo administrativo.</div>,
  4: (
    <div className="space-y-4">
      <p><strong>Analiza</strong> el Reglamento del Aprendiz y <strong>adopta</strong> las normas de SST en oficinas y los principios de ética administrativa.</p>
      <ReglamentoQuiz />
    </div>
  ),
  5: <div><strong>Resume</strong> el funcionamiento de la Agencia Pública de Empleo (APE) y <strong>planifica</strong> los requisitos para tu etapa productiva.</div>,
};

export default function App() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [aprendiz, setAprendiz] = useState<{ nombre: string; documento: string } | null>(null);

  if (!aprendiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Registro de Aprendiz</h2>
          <input type="text" placeholder="Nombre completo" className="w-full p-2 mb-4 border rounded" onChange={(e) => setAprendiz({...aprendiz!, nombre: e.target.value})} />
          <input type="text" placeholder="Número de documento" className="w-full p-2 mb-4 border rounded" onChange={(e) => setAprendiz({...aprendiz!, documento: e.target.value})} />
          <button onClick={() => setAprendiz({ nombre: 'Pendiente', documento: 'Pendiente' })} className="w-full bg-blue-600 text-white p-2 rounded">Iniciar Inducción</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SENA Induction Hub</h1>
          <p className="text-gray-600">Bienvenido, {aprendiz.nombre}</p>
        </div>
        <button onClick={() => setAprendiz(null)} className="text-sm text-gray-500 underline">Cambiar aprendiz</button>
      </header>

      {!activeModule ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-left flex flex-col gap-4"
            >
              <div className={`${m.color} p-3 rounded-lg text-white w-fit`}>
                <m.icon size={24} />
              </div>
              <h2 className="text-xl font-semibold">{m.title}</h2>
              <p className="text-gray-600">{m.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <button onClick={() => setActiveModule(null)} className="flex items-center gap-2 text-blue-600 mb-6">
            <ChevronLeft size={20} /> Volver al inicio
          </button>
          <h2 className="text-2xl font-bold mb-4">{modules.find(m => m.id === activeModule)?.title}</h2>
          {activeModule === 4 ? (
             <div className="space-y-4">
                <p><strong>Analiza</strong> el Reglamento del Aprendiz y <strong>adopta</strong> las normas de SST en oficinas y los principios de ética administrativa.</p>
                <ReglamentoQuiz aprendiz={aprendiz} />
             </div>
          ) : (
             moduleContents[activeModule]
          )}
        </div>
      )}
    </div>
  );
}
