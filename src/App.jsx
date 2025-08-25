import { useState, useCallback, useEffect } from 'react';
import './App.css';

// A lista de palavras pode ficar fora do componente, pois não muda.
const easyWords = [
  'abacaxi', 'elefante', 'biblioteca', 'computador', 'orquestra', 'galaxia',
  'montanha', 'universo', 'chocolate', 'aventura', 'dinossauro', 'borboleta',
  'cachoeira', 'primavera', 'paralelepipedo', 'fotografia', 'tecnologia',
  'girassol', 'hipopotamo', 'otorrinolaringologista', 'independencia', 'vocabulario',
  'liquidificador', 'sustentabilidade', 'esparadrapo', 'quinquênio'
];

// Os componentes de ícones também podem ficar fora.
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const RefreshCwIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

// Início da única e correta declaração da função App
function App() {
  // --- SEÇÃO DE ESTADOS (useState) ---
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [isEasyToSay, setIsEasyToSay] = useState(false);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  // --- SEÇÃO DE LÓGICA (useCallback) ---
  const generateRandomPassword = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let charSet = '';
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;
    if (charSet === '') return '';
    let newPassword = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        newPassword += charSet[randomIndex];
    }
    return newPassword;
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generateEasyPassword = useCallback(() => {
    const word = easyWords[Math.floor(Math.random() * easyWords.length)];
    let modifiedWord = word;
    const leetMap = { 'a': '@', 'e': '3', 'i': '1', 'o': '0', 's': '$' };
    const charsInWord = modifiedWord.split('').filter(c => leetMap[c]);
    if (charsInWord.length > 0) {
        const charToReplace = charsInWord[Math.floor(Math.random() * charsInWord.length)];
        modifiedWord = modifiedWord.replace(charToReplace, leetMap[charToReplace]);
    }
    const randomIndex = Math.floor(Math.random() * modifiedWord.length);
    modifiedWord = modifiedWord.substring(0, randomIndex) +
                   modifiedWord[randomIndex].toUpperCase() +
                   modifiedWord.substring(randomIndex + 1);
    const remainingLength = length - modifiedWord.length;
    let padding = '';
    const paddingChars = '0123456789!@#$%&*?';
    if (remainingLength > 0) {
        for (let i = 0; i < remainingLength; i++) {
            padding += paddingChars[Math.floor(Math.random() * paddingChars.length)];
        }
    }
    let finalPassword = modifiedWord + padding;
    return finalPassword.slice(0, length);
  }, [length]);

  const generatePassword = useCallback(() => {
    let newPassword = '';
    if (isEasyToSay) {
      newPassword = generateEasyPassword();
    } else {
      newPassword = generateRandomPassword();
    }
    setPassword(newPassword);
    setCopied(false);
  }, [isEasyToSay, generateEasyPassword, generateRandomPassword]);

  // --- SEÇÃO DE EFEITOS (useEffect) ---
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // --- SEÇÃO DE FUNÇÕES AUXILIARES ---
  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- SEÇÃO DE RENDERIZAÇÃO (return com JSX) ---
  return (
    <div className="app-container">
      <div className="generator-box">
        <div className="generator-header">
          <ShieldCheckIcon />
          <h1>Gerador de Senhas</h1>
        </div>
        <p className="subtitle">Crie senhas fortes e seguras para proteger suas contas.</p>
        
        <div className="password-display-container">
          <span className="password-text">{password || 'P@s$w0rdExampL3'}</span>
          <div className="password-actions">
            <button onClick={copyToClipboard} className="icon-button" title="Copiar senha">
              <CopyIcon />
            </button>
            <button onClick={generatePassword} className="icon-button" title="Gerar nova senha">
              <RefreshCwIcon />
            </button>
          </div>
        </div>
        
        <div className="customization-section">
          <h2>Personalizar sua senha</h2>
          
          <div className="control-group">
            <div className="length-label">
              <label htmlFor="length">Comprimento da Senha</label>
              <span>{length}</span>
            </div>
            <input
              type="range"
              id="length"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <div className="settings-grid">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={isEasyToSay} 
                onChange={() => setIsEasyToSay(!isEasyToSay)} 
              />
              <span className="custom-checkbox"></span>
              Fácil de falar
            </label>

            <label className={`setting-label ${isEasyToSay ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                checked={includeUppercase} 
                onChange={() => setIncludeUppercase(!includeUppercase)}
                disabled={isEasyToSay}
              />
              <span className="custom-checkbox"></span>
              Letras Maiúsculas
            </label>

            <label className={`setting-label ${isEasyToSay ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                checked={includeLowercase} 
                onChange={() => setIncludeLowercase(!includeLowercase)}
                disabled={isEasyToSay}
              />
              <span className="custom-checkbox"></span>
              Letras Minúsculas
            </label>

            <label className={`setting-label ${isEasyToSay ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                checked={includeNumbers} 
                onChange={() => setIncludeNumbers(!includeNumbers)}
                disabled={isEasyToSay}
              />
              <span className="custom-checkbox"></span>
              Incluir Números
            </label>

            <label className={`setting-label ${isEasyToSay ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                checked={includeSymbols} 
                onChange={() => setIncludeSymbols(!includeSymbols)}
                disabled={isEasyToSay}
              />
              <span className="custom-checkbox"></span>
              Incluir Símbolos
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;