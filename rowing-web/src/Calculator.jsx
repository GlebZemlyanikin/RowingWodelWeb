import './Calculator.css';
import ThemeToggle from './components/ThemeToggle';
import ModelTypeSelect from './components/ModelTypeSelect';
import AthleteCard from './components/AthleteCard';
import ResultsTable from './components/ResultsTable';
import { useCalculatorState } from './hooks/useCalculatorState';

export default function Calculator() {
    const {
        theme,
        toggleTheme,
        modelType,
        setModelType,
        modelTableKeys,
        currentModel,
        athletes,
        results,
        maxSegments,
        distances,
        handleAthleteChange,
        handleSegmentChange,
        addAthlete,
        removeAthlete,
        addSegment,
        removeSegment,
        handleCalc,
        handleExport,
    } = useCalculatorState();

    return (
        <div className="calculator-root" data-theme={theme}>
            <div className="calculator-page">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <div className="calculator-card">
                    <h2 className="calculator-title">
                        Калькулятор модельного времени
                    </h2>
                    <ModelTypeSelect
                        id="model-type-select"
                        value={modelType}
                        options={modelTableKeys}
                        onChange={setModelType}
                    />
                    <hr className="calculator-divider" />
                    <h3 className="calculator-subtitle">Данные спортсменов</h3>
                    {athletes.map((ath) => (
                        <AthleteCard
                            key={ath.id}
                            athlete={ath}
                            currentModel={currentModel}
                            distances={distances}
                            canRemoveAthlete={athletes.length > 1}
                            onAthleteChange={handleAthleteChange}
                            onSegmentChange={handleSegmentChange}
                            onRemoveAthlete={removeAthlete}
                            onAddSegment={addSegment}
                            onRemoveSegment={removeSegment}
                        />
                    ))}
                    <button
                        type="button"
                        className="calculator-btn"
                        onClick={addAthlete}
                    >
                        Добавить спортсмена
                    </button>
                    <br />
                    <button
                        type="button"
                        className="calculator-btn calculator-btn-calc"
                        onClick={handleCalc}
                    >
                        Рассчитать
                    </button>
                    <ResultsTable
                        results={results}
                        maxSegments={maxSegments}
                        onExport={handleExport}
                    />
                </div>
            </div>
        </div>
    );
}
