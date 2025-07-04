import React, { useCallback, useState } from 'react';
import { Upload, FileText, Github, Folder, X } from 'lucide-react';
import { useAnalysis } from '../../contexts/AnalysisContext';
import toast from 'react-hot-toast';

const UploadTab: React.FC = () => {
  const { uploadFiles, startAnalysis } = useAnalysis();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.js') || 
      file.name.endsWith('.ts') || 
      file.name.endsWith('.tsx') || 
      file.name.endsWith('.jsx') ||
      file.name.endsWith('.vue') ||
      file.name.endsWith('.py') ||
      file.name.endsWith('.java')
    );

    if (files.length === 0) {
      toast.error('Veuillez sélectionner des fichiers de code valides');
      return;
    }

    setUploadedFiles(files);
    toast.success(`${files.length} fichier(s) ajouté(s)`);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    toast.success(`${files.length} fichier(s) sélectionné(s)`);
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    try {
      await uploadFiles(uploadedFiles);
      toast.success('Fichiers uploadés avec succès !');
      setTimeout(() => {
        startAnalysis();
      }, 1000);
    } catch (error) {
      toast.error('Erreur lors de l\'upload des fichiers');
    }
  }, [uploadedFiles, uploadFiles, startAnalysis]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-3 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload de Code
          </h1>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
            Glissez-déposez vos fichiers de code ou sélectionnez-les pour commencer l'analyse
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all duration-300 mb-6 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Glissez vos fichiers ici
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
            Ou cliquez pour sélectionner des fichiers
          </p>
          <input
            type="file"
            multiple
            accept=".js,.ts,.tsx,.jsx,.vue,.py,.java"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm md:text-base"
          >
            <Folder className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Sélectionner des fichiers
          </label>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-4">
            Formats supportés: .js, .ts, .tsx, .jsx, .vue, .py, .java
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fichiers sélectionnés ({uploadedFiles.length})
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4">
              <div className="max-h-48 md:max-h-64 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                className="px-6 md:px-8 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
              >
                Commencer l'analyse
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3 md:mb-4">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analyse Multi-langages
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Support pour JavaScript, TypeScript, Python, Java, Vue.js et plus
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 md:mb-4">
              <Github className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Outils Professionnels
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              ESLint, Prettier, CodeLlama 13B, Madge pour une analyse complète
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3 md:mb-4">
              <Upload className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Sécurisé
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Vos fichiers sont traités localement et en toute sécurité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTab;