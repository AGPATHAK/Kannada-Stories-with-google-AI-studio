import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Languages, Volume2, ArrowRight } from 'lucide-react';
import { VocabularyWord } from '../lib/gemini';

interface VocabularyViewProps {
  vocabulary: VocabularyWord[];
  onFinish: () => void;
}

export default function VocabularyView({ vocabulary, onFinish }: VocabularyViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex p-4 bg-brand-100 rounded-full mb-4"
        >
          <BookOpen className="w-8 h-8 text-brand-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-800">New Words Learned!</h2>
        <p className="text-slate-500 mt-2">Great job! Let's review the key vocabulary from this story.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {vocabulary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="kannada-text text-2xl font-bold text-brand-700">{item.word}</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-wider">
                {item.pronunciation}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Languages className="w-4 h-4 text-brand-400" />
              <span className="font-medium">{item.meaning}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onFinish}
          className="flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 hover:scale-105 transition-all shadow-lg"
        >
          Finish Story
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
