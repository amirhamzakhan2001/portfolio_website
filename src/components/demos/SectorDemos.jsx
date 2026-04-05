import { useState, useCallback, useEffect } from 'react'

// ── Disease Risk Predictor ────────────────────────────────────────────────────
function DiseaseRisk() {
  const [inputs, setInputs] = useState({ age: 45, bmi: 27, bloodPressure: 120, glucose: 100, smoking: 0, familyHistory: 0 })
  const [risk, setRisk] = useState(null)

  const predict = useCallback(() => {
    const { age, bmi, bloodPressure, glucose, smoking, familyHistory } = inputs
    // Logistic regression-style scoring
    let score = -5.5
    score += 0.04 * age
    score += 0.08 * (bmi - 18.5)
    score += 0.02 * (bloodPressure - 80)
    score += 0.03 * (glucose - 70)
    score += 0.8 * smoking
    score += 0.6 * familyHistory
    const prob = 1 / (1 + Math.exp(-score))
    const label = prob < 0.2 ? 'Low Risk' : prob < 0.5 ? 'Moderate Risk' : prob < 0.75 ? 'High Risk' : 'Very High Risk'
    const color = prob < 0.2 ? 'text-green-400' : prob < 0.5 ? 'text-yellow-400' : prob < 0.75 ? 'text-orange-400' : 'text-red-400'
    const factors = []
    if (age > 55) factors.push('Age > 55')
    if (bmi > 30) factors.push('BMI > 30 (Obese)')
    if (bloodPressure > 130) factors.push('High Blood Pressure')
    if (glucose > 125) factors.push('High Glucose')
    if (smoking) factors.push('Smoker')
    if (familyHistory) factors.push('Family History')
    setRisk({ prob, label, color, factors })
  }, [inputs])

  useEffect(() => { predict() }, [predict])

  const fields = [
    { key: 'age', label: 'Age', min: 18, max: 90, unit: 'yrs' },
    { key: 'bmi', label: 'BMI', min: 15, max: 45, unit: '' },
    { key: 'bloodPressure', label: 'Systolic BP', min: 70, max: 200, unit: 'mmHg' },
    { key: 'glucose', label: 'Fasting Glucose', min: 60, max: 300, unit: 'mg/dL' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, min, max, unit }) => (
          <div key={key}>
            <label className="text-[10px] font-mono text-text-muted block mb-1">{label}: <span className="text-accent-indigo">{inputs[key]} {unit}</span></label>
            <input type="range" min={min} max={max} value={inputs[key]} onChange={e => setInputs(prev => ({ ...prev, [key]: +e.target.value }))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {[{ key: 'smoking', label: 'Smoker' }, { key: 'familyHistory', label: 'Family History' }].map(({ key, label }) => (
          <button key={key} onClick={() => setInputs(prev => ({ ...prev, [key]: prev[key] ? 0 : 1 }))}
            className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-all ${inputs[key] ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-text-muted'}`}>
            {inputs[key] ? '✓' : '○'} {label}
          </button>
        ))}
      </div>

      {risk && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <div className={`text-2xl font-bold font-mono ${risk.color}`}>{(risk.prob * 100).toFixed(1)}%</div>
              <div className={`text-xs font-mono ${risk.color}`}>{risk.label}</div>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${risk.prob * 100}%`,
                  background: risk.prob < 0.2 ? '#22c55e' : risk.prob < 0.5 ? '#eab308' : risk.prob < 0.75 ? '#f97316' : '#ef4444'
                }} />
              </div>
            </div>
          </div>
          {risk.factors.length > 0 && (
            <div>
              <div className="text-[9px] font-mono text-text-muted mb-1">Risk factors detected:</div>
              <div className="flex flex-wrap gap-1">
                {risk.factors.map(f => <span key={f} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{f}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
      <p className="text-[10px] font-mono text-text-muted text-center">Educational demo only — not a medical tool</p>
    </div>
  )
}

// ── Medical Classifier ────────────────────────────────────────────────────────
function MedicalClassifier() {
  const [symptoms, setSymptoms] = useState([])
  const [result, setResult] = useState(null)

  const symptomList = ['Fever', 'Cough', 'Headache', 'Fatigue', 'Sore Throat', 'Runny Nose', 'Chest Pain', 'Shortness of Breath', 'Nausea', 'Body Ache', 'Loss of Taste/Smell', 'Diarrhea']

  const conditions = [
    { name: 'COVID-19', triggers: ['Fever', 'Cough', 'Fatigue', 'Loss of Taste/Smell', 'Shortness of Breath'], color: '#ef4444' },
    { name: 'Common Cold', triggers: ['Runny Nose', 'Sore Throat', 'Cough', 'Headache'], color: '#f59e0b' },
    { name: 'Influenza', triggers: ['Fever', 'Body Ache', 'Fatigue', 'Cough', 'Headache'], color: '#6366f1' },
    { name: 'Seasonal Allergy', triggers: ['Runny Nose', 'Headache', 'Fatigue'], color: '#22c55e' },
    { name: 'Pneumonia', triggers: ['Fever', 'Chest Pain', 'Shortness of Breath', 'Cough', 'Fatigue'], color: '#a855f7' },
  ]

  const classify = useCallback(() => {
    if (symptoms.length === 0) { setResult(null); return }
    const scored = conditions.map(c => ({
      ...c,
      score: c.triggers.filter(t => symptoms.includes(t)).length / c.triggers.length,
      matched: c.triggers.filter(t => symptoms.includes(t)),
    })).sort((a, b) => b.score - a.score)
    setResult(scored)
  }, [symptoms])

  useEffect(() => { classify() }, [classify])

  const toggle = s => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {symptomList.map(s => (
          <button key={s} onClick={() => toggle(s)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${symptoms.includes(s) ? 'bg-accent-indigo/20 border-accent-indigo/40 text-accent-indigo' : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      {result && result.length > 0 && (
        <div className="space-y-2">
          {result.slice(0, 3).map((c, i) => (
            <div key={c.name} className={`glass rounded-lg p-3 border ${i === 0 ? 'border-white/15' : 'border-white/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="text-xs font-bold font-mono text-text-primary">{c.name}</span>
                <span className="ml-auto text-xs font-mono" style={{ color: c.color }}>{(c.score * 100).toFixed(0)}% match</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full mb-2">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.score * 100}%`, background: c.color }} />
              </div>
              {c.matched.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.matched.map(m => <span key={m} className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-text-muted">{m}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {symptoms.length === 0 && <p className="text-xs font-mono text-text-muted text-center py-4">Select symptoms above to classify</p>}
      <p className="text-[10px] font-mono text-text-muted text-center">Educational demo — consult a doctor for actual diagnosis</p>
    </div>
  )
}

// ── Stock Predictor ───────────────────────────────────────────────────────────
function StockPredictor() {
  const [ticker, setTicker] = useState('AAPL')
  const [window, setWindow] = useState(5)
  const [data, setData] = useState(null)

  const generate = useCallback(() => {
    const base = { AAPL: 185, GOOGL: 170, MSFT: 420, TSLA: 250, AMZN: 195 }[ticker] ?? 100
    const prices = [base]
    for (let i = 1; i < 30; i++) {
      prices.push(+(prices[i - 1] * (1 + (Math.random() - 0.48) * 0.03)).toFixed(2))
    }

    // Moving average
    const ma = prices.map((_, i) => {
      if (i < window - 1) return null
      return +(prices.slice(i - window + 1, i + 1).reduce((a, b) => a + b) / window).toFixed(2)
    })

    // Simple prediction (last MA + trend)
    const lastMA = ma[ma.length - 1]
    const trend = (ma[ma.length - 1] - ma[ma.length - 6]) / 5
    const predictions = [prices[prices.length - 1], ...Array.from({ length: 5 }, (_, i) => +(prices[prices.length - 1] + trend * (i + 1) + (Math.random() - 0.5) * 3).toFixed(2))]

    setData({ prices, ma, predictions, base })
  }, [ticker, window])

  useEffect(() => { generate() }, [generate])

  const allVals = data ? [...data.prices, ...data.predictions.slice(1)] : [0]
  const yMin = Math.min(...allVals) * 0.99
  const yMax = Math.max(...allVals) * 1.01

  const toX = (i, total, W) => 10 + (i / (total - 1)) * (W - 20)
  const toY = (v, H) => 10 + (1 - (v - yMin) / (yMax - yMin)) * (H - 20)
  const W = 300, H = 160
  const n = data?.prices.length ?? 1

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'].map(t => (
          <button key={t} onClick={() => setTicker(t)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${ticker === t ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {t}
          </button>
        ))}
        <label className="ml-auto text-xs font-mono text-text-muted">MA window: <span className="text-accent-cyan">{window}</span></label>
        <input type="range" min={2} max={10} value={window} onChange={e => setWindow(+e.target.value)} className="w-20 accent-cyan-500" />
      </div>

      {data && (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: H }}>
          {/* Price line */}
          <polyline
            points={data.prices.map((v, i) => `${toX(i, n, W)},${toY(v, H)}`).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

          {/* MA line */}
          <polyline
            points={data.ma.filter(v => v !== null).map((v, i) => `${toX(i + window - 1, n, W)},${toY(v, H)}`).join(' ')}
            fill="none" stroke="#06b6d4" strokeWidth={1.5} />

          {/* Prediction */}
          <polyline
            points={data.predictions.map((v, i) => `${toX(n - 1 + i, n + 4, W)},${toY(v, H)}`).join(' ')}
            fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2" />

          {/* Prediction area */}
          <polygon
            points={[
              ...data.predictions.map((v, i) => `${toX(n - 1 + i, n + 4, W)},${toY(v * 1.02, H)}`),
              ...[...data.predictions].reverse().map((v, i) => `${toX(n + 4 - i, n + 4, W)},${toY(v * 0.98, H)}`),
            ].join(' ')}
            fill="rgba(99,102,241,0.1)" />

          <text x={10} y={14} fill="rgba(255,255,255,0.5)" fontSize={8} fontFamily="monospace">${data.prices[data.prices.length - 1]}</text>
          <text x={W - 40} y={14} fill="#6366f1" fontSize={8} fontFamily="monospace">forecast</text>
        </svg>
      )}

      <div className="flex gap-4 text-[10px] font-mono text-text-muted">
        <span><span className="text-white/50">—</span> Price</span>
        <span><span className="text-accent-cyan">—</span> MA({window})</span>
        <span><span className="text-accent-indigo">- -</span> Forecast</span>
      </div>
      <p className="text-[10px] font-mono text-text-muted text-center">Simulated data — not financial advice</p>
    </div>
  )
}

// ── Credit Risk ───────────────────────────────────────────────────────────────
function CreditRisk() {
  const [inputs, setInputs] = useState({ income: 50000, loanAmount: 20000, creditScore: 680, employmentYears: 3, existingDebt: 5000, loanTerm: 36 })

  const dti = (inputs.loanAmount / inputs.income * 100).toFixed(1)
  const lti = (inputs.loanAmount / Math.max(inputs.income, 1)).toFixed(2)

  const score = () => {
    let s = 0
    if (inputs.creditScore >= 750) s += 30
    else if (inputs.creditScore >= 700) s += 20
    else if (inputs.creditScore >= 650) s += 10
    else s -= 10

    if (inputs.income > 80000) s += 20
    else if (inputs.income > 50000) s += 10

    if (+dti < 20) s += 15
    else if (+dti < 35) s += 5
    else s -= 15

    if (inputs.employmentYears >= 5) s += 15
    else if (inputs.employmentYears >= 2) s += 8

    if (inputs.existingDebt < 10000) s += 10
    else if (inputs.existingDebt > 30000) s -= 10

    return Math.max(0, Math.min(100, s + 30))
  }

  const creditScore = score()
  const label = creditScore >= 70 ? 'Low Risk — Approve' : creditScore >= 50 ? 'Moderate Risk — Review' : 'High Risk — Decline'
  const labelColor = creditScore >= 70 ? 'text-green-400' : creditScore >= 50 ? 'text-yellow-400' : 'text-red-400'
  const interestRate = creditScore >= 70 ? 7.5 : creditScore >= 50 ? 12.5 : 18.0

  const fields = [
    { key: 'income', label: 'Annual Income', min: 10000, max: 200000, step: 1000, prefix: '₹' },
    { key: 'loanAmount', label: 'Loan Amount', min: 1000, max: 100000, step: 1000, prefix: '₹' },
    { key: 'creditScore', label: 'Credit Score', min: 300, max: 850, step: 10, prefix: '' },
    { key: 'employmentYears', label: 'Employment Years', min: 0, max: 30, step: 1, prefix: '' },
    { key: 'existingDebt', label: 'Existing Debt', min: 0, max: 100000, step: 1000, prefix: '₹' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, min, max, step, prefix }) => (
          <div key={key}>
            <label className="text-[10px] font-mono text-text-muted block mb-1">{label}: <span className="text-accent-indigo">{prefix}{inputs[key].toLocaleString()}</span></label>
            <input type="range" min={min} max={max} step={step} value={inputs[key]} onChange={e => setInputs(prev => ({ ...prev, [key]: +e.target.value }))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[10px] font-mono text-text-muted">Credit Score</div>
            <div className={`text-2xl font-bold font-mono ${labelColor}`}>{creditScore}/100</div>
            <div className={`text-xs font-mono ${labelColor}`}>{label}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-text-muted">Suggested Rate</div>
            <div className="text-xl font-bold font-mono text-accent-cyan">{interestRate}%</div>
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full mb-3">
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${creditScore}%`,
            background: creditScore >= 70 ? '#22c55e' : creditScore >= 50 ? '#eab308' : '#ef4444'
          }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex justify-between"><span className="text-text-muted">Debt-to-Income:</span><span className={+dti > 35 ? 'text-red-400' : 'text-green-400'}>{dti}%</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Loan-to-Income:</span><span className={+lti > 0.5 ? 'text-red-400' : 'text-green-400'}>{lti}x</span></div>
        </div>
      </div>
    </div>
  )
}

// ── Fraud Detection ───────────────────────────────────────────────────────────
function FraudDetection() {
  const [txn, setTxn] = useState({ amount: 150, hour: 14, country: 'US', merchantType: 'retail', deviceMatch: 1, prevTxn24h: 2, unusualLocation: 0 })
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const detect = useCallback(() => {
    let score = 0
    const flags = []

    if (txn.amount > 500) { score += 20; flags.push(`High amount ($${txn.amount})`) }
    if (txn.amount > 2000) { score += 30; flags.push('Very high amount') }
    if (txn.hour < 5 || txn.hour > 23) { score += 15; flags.push('Unusual hour') }
    if (txn.country !== 'US') { score += 25; flags.push('Foreign transaction') }
    if (txn.merchantType === 'gambling') { score += 20; flags.push('Gambling merchant') }
    if (!txn.deviceMatch) { score += 35; flags.push('Unknown device') }
    if (txn.prevTxn24h > 10) { score += 25; flags.push('High transaction velocity') }
    if (txn.unusualLocation) { score += 30; flags.push('Unusual location') }

    const prob = Math.min(0.98, score / 100)
    const label = prob < 0.3 ? 'Legitimate' : prob < 0.6 ? 'Suspicious' : 'Likely Fraud'
    const color = prob < 0.3 ? 'text-green-400' : prob < 0.6 ? 'text-yellow-400' : 'text-red-400'
    setResult({ prob, label, color, flags })
    return { prob, label, amount: txn.amount, time: new Date().toLocaleTimeString() }
  }, [txn])

  const runAndAdd = () => {
    const r = detect()
    if (r) setHistory(prev => [r, ...prev.slice(0, 4)])
  }

  useEffect(() => { detect() }, [detect])

  const countries = ['US', 'UK', 'India', 'Russia', 'Nigeria', 'China']
  const merchants = ['retail', 'food', 'travel', 'gambling', 'electronics', 'ATM']

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Amount ($): <span className="text-accent-indigo">{txn.amount}</span></label>
          <input type="range" min={1} max={5000} value={txn.amount} onChange={e => setTxn(p => ({ ...p, amount: +e.target.value }))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Hour: <span className="text-accent-indigo">{txn.hour}:00</span></label>
          <input type="range" min={0} max={23} value={txn.hour} onChange={e => setTxn(p => ({ ...p, hour: +e.target.value }))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Country</label>
          <select value={txn.country} onChange={e => setTxn(p => ({ ...p, country: e.target.value }))}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-text-primary focus:outline-none">
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Merchant Type</label>
          <select value={txn.merchantType} onChange={e => setTxn(p => ({ ...p, merchantType: e.target.value }))}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-text-primary focus:outline-none">
            {merchants.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Txns last 24h: <span className="text-accent-indigo">{txn.prevTxn24h}</span></label>
          <input type="range" min={0} max={20} value={txn.prevTxn24h} onChange={e => setTxn(p => ({ ...p, prevTxn24h: +e.target.value }))} className="w-full accent-indigo-500" />
        </div>
        <div className="flex gap-2">
          {[{ key: 'deviceMatch', label: 'Known Device' }, { key: 'unusualLocation', label: 'Unusual Location' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTxn(p => ({ ...p, [key]: p[key] ? 0 : 1 }))}
              className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all ${txn[key] ? (key === 'deviceMatch' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400') : 'bg-white/5 border-white/10 text-text-muted'}`}>
              {txn[key] ? '✓' : '○'} {label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-lg font-bold font-mono ${result.color}`}>{result.label}</div>
            <div className={`text-xl font-bold font-mono ${result.color}`}>{(result.prob * 100).toFixed(0)}%</div>
          </div>
          <div className="h-2 bg-white/5 rounded-full mb-2">
            <div className="h-full rounded-full transition-all duration-300" style={{
              width: `${result.prob * 100}%`,
              background: result.prob < 0.3 ? '#22c55e' : result.prob < 0.6 ? '#eab308' : '#ef4444'
            }} />
          </div>
          {result.flags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.flags.map(f => <span key={f} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{f}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Churn Predictor ───────────────────────────────────────────────────────────
function ChurnPredictor() {
  const [inputs, setInputs] = useState({ tenure: 12, monthlyCharges: 65, support: 2, logins: 8, features: 3, satisfaction: 3, contractType: 'monthly' })
  const [result, setResult] = useState(null)

  const predict = useCallback(() => {
    let score = 0
    if (inputs.tenure < 6) score += 25
    else if (inputs.tenure < 18) score += 10
    else score -= 10

    if (inputs.monthlyCharges > 80) score += 15
    if (inputs.support > 4) score += 20
    else if (inputs.support < 2) score -= 5

    if (inputs.logins < 3) score += 20
    else if (inputs.logins > 15) score -= 15

    if (inputs.features < 2) score += 15
    if (inputs.satisfaction <= 2) score += 30
    else if (inputs.satisfaction >= 4) score -= 20

    if (inputs.contractType === 'annual') score -= 20
    if (inputs.contractType === '2year') score -= 35

    const prob = Math.max(0.02, Math.min(0.97, (score + 30) / 100))
    const label = prob < 0.3 ? 'Will Stay' : prob < 0.6 ? 'At Risk' : 'Likely to Churn'
    const color = prob < 0.3 ? 'text-green-400' : prob < 0.6 ? 'text-yellow-400' : 'text-red-400'

    const recommendations = []
    if (inputs.support > 4) recommendations.push('Proactive support outreach')
    if (inputs.logins < 3) recommendations.push('Re-engagement email campaign')
    if (inputs.features < 2) recommendations.push('Feature adoption training')
    if (inputs.satisfaction <= 2) recommendations.push('Satisfaction survey + discount offer')
    if (inputs.contractType === 'monthly') recommendations.push('Offer annual plan incentive')

    setResult({ prob, label, color, recommendations })
  }, [inputs])

  useEffect(() => { predict() }, [predict])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'tenure', label: 'Tenure (months)', min: 1, max: 72 },
          { key: 'monthlyCharges', label: 'Monthly Charges ($)', min: 20, max: 150 },
          { key: 'support', label: 'Support Tickets', min: 0, max: 10 },
          { key: 'logins', label: 'Logins/Month', min: 0, max: 30 },
          { key: 'features', label: 'Features Used', min: 0, max: 10 },
          { key: 'satisfaction', label: 'Satisfaction (1-5)', min: 1, max: 5 },
        ].map(({ key, label, min, max }) => (
          <div key={key}>
            <label className="text-[10px] font-mono text-text-muted block mb-1">{label}: <span className="text-accent-indigo">{inputs[key]}</span></label>
            <input type="range" min={min} max={max} value={inputs[key]} onChange={e => setInputs(p => ({ ...p, [key]: +e.target.value }))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <span className="text-[10px] font-mono text-text-muted self-center">Contract:</span>
        {['monthly', 'annual', '2year'].map(c => (
          <button key={c} onClick={() => setInputs(p => ({ ...p, contractType: c }))}
            className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all ${inputs.contractType === c ? 'bg-accent-indigo/20 border-accent-indigo/30 text-accent-indigo' : 'bg-white/5 border-white/10 text-text-muted'}`}>
            {c}
          </button>
        ))}
      </div>

      {result && (
        <div className="glass rounded-xl p-4 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-lg font-bold font-mono ${result.color}`}>{result.label}</div>
              <div className="text-xs font-mono text-text-muted">Churn Probability: <span className={result.color}>{(result.prob * 100).toFixed(0)}%</span></div>
            </div>
          </div>
          <div className="h-2 bg-white/5 rounded-full">
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${result.prob * 100}%`,
              background: result.prob < 0.3 ? '#22c55e' : result.prob < 0.6 ? '#eab308' : '#ef4444'
            }} />
          </div>
          {result.recommendations.length > 0 && (
            <div>
              <div className="text-[9px] font-mono text-text-muted mb-1">Retention recommendations:</div>
              <ul className="space-y-0.5">
                {result.recommendations.map(r => (
                  <li key={r} className="text-[10px] text-text-secondary flex items-start gap-1.5">
                    <span className="text-accent-indigo mt-0.5">▸</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
const COMPONENTS = {
  DiseaseRisk,
  MedicalClassifier,
  StockPredictor,
  CreditRisk,
  FraudDetection,
  ChurnPredictor,
}

export default function SectorDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
