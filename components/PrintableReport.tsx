import React from 'react';
import { AnalysisReport } from '../types';
import { OverviewTab } from './tabs/OverviewTab';
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { DataFlowTab } from './tabs/DataFlowTab';
import { ImprovementsTab } from './tabs/ImprovementsTab';

interface PrintableReportProps {
    report: AnalysisReport;
}

const PrintableSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8" style={{ pageBreakInside: 'avoid' }}>
        <h2 className="text-2xl font-bold border-b-2 border-cyan-400 pb-2 mb-4 text-white">
            {title}
        </h2>
        {children}
    </section>
);


export const PrintableReport: React.FC<PrintableReportProps> = ({ report }) => {
    return (
        // Note: The parent div that renders this component is responsible for the dark background color.
        <div id="printable-content" className="p-8 text-gray-100 font-sans">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white">{report.projectName}</h1>
                <p className="text-gray-400 mt-2">
                    Analysis Report generated on {new Date(report.analysisDate).toLocaleString()}
                </p>
            </header>
            
            <PrintableSection title="Overview">
                <OverviewTab overview={report.overview} />
            </PrintableSection>

            <PrintableSection title="Architecture">
                <ArchitectureTab architecture={report.architecture} />
            </PrintableSection>

            <PrintableSection title="Data Flow">
                <DataFlowTab dataFlow={report.dataFlow} />
            </PrintableSection>

            <PrintableSection title="Improvement Suggestions">
                <ImprovementsTab improvements={report.improvements} />
            </PrintableSection>
        </div>
    );
};