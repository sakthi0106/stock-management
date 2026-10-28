import React, { useState, useEffect } from 'react';
import { SyncRun, WorkbookInspectResult } from '../types';
import { ApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  RefreshCw, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  FileCheck, 
  AlertOctagon,
  Copy,
  ChevronRight
} from 'lucide-react';

export const SyncManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [syncStatus, setSyncStatus] = useState<{ latest_run: SyncRun | null; history: SyncRun[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [inspectResult, setInspectResult] = useState<WorkbookInspectResult | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const fetchStatus = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await ApiClient.getSyncStatus();
      setSyncStatus(res);
    } catch (err) {
      console.error('Failed to load sync status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const intervalId = window.setInterval(() => fetchStatus(true), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleFileInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSyncFeedback(null);
    try {
      const res = await ApiClient.inspectWorkbook(file);
      setInspectResult(res);
    } catch (err: any) {
      alert(`Inspection failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSync = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(`Are you sure you want to synchronize '${file.name}'? All rows will be validated and deduplicated.`)) {
      return;
    }

    setIsUploading(true);
    setSyncFeedback(null);
    try {
      const res = await ApiClient.manualSyncUpload(file);
      setSyncFeedback(res.message);
      await fetchStatus();
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Excel Synchronization & Mapping Engine</h2>
          <p className="text-xs text-slate-500">
            Read-only ingestion, automated deduplication, and LAN agent configuration.
          </p>
        </div>

        <button
          onClick={() => fetchStatus()}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {syncFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Two Action Panels: Manual File Sync & Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Panel 1: Inspect Workbook Before Import */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inspect & Preview Workbook</h3>
              <p className="text-xs text-slate-500">Inspect sheets, headers, and mapping rules without importing.</p>
            </div>
          </div>

          <label className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition block text-center">
            <UploadCloud className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-xs font-semibold text-slate-700">Choose .xlsx or .xlsm to inspect</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Read-only preview mode</span>
            <input
              type="file"
              accept=".xlsx,.xlsm"
              onChange={handleFileInspect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Panel 2: Manual Direct Sync Upload */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manual Synchronize Upload</h3>
              <p className="text-xs text-slate-500">Immediately ingest, validate, and deduplicate an updated workbook.</p>
            </div>
          </div>

          <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition block text-center">
            <FileSpreadsheet className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-xs font-semibold text-slate-700">Upload and Sync Workbook</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Idempotent: Identical rows are skipped</span>
            <input
              type="file"
              accept=".xlsx,.xlsm"
              onChange={handleManualSync}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Inspection Results Modal/Card (if inspected) */}
      {inspectResult && (
        <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Inspection Report: {inspectResult.file_name}</span>
            </h3>
            <span className="font-mono text-[10px] text-slate-400">
              SHA-256: {inspectResult.file_hash.substring(0, 16)}...
            </span>
          </div>

          <div className="space-y-4">
            {inspectResult.sheets.map((s) => (
              <div key={s.sheet_name} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-2">
                  <span>Worksheet: &quot;{s.sheet_name}&quot;</span>
                  <span className="text-slate-500">{s.total_rows} rows &bull; {s.total_cols} columns</span>
                </div>
                <div className="text-[11px] text-slate-600 mb-2">
                  <strong>Detected Columns:</strong> {s.sample_headers.join(', ')}
                </div>
                {inspectResult.detected_recommendations[s.sheet_name] && (
                  <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-purple-900">
                    <strong>Auto-Mapping Match:</strong> Detected as {inspectResult.detected_recommendations[s.sheet_name].likely_sheet_type}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* On-Premise LAN Sync Agent Instructions */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">On-Premise LAN Synchronization Agent</h3>
              <p className="text-xs text-slate-400">
                Deploy inside your private office network to automatically sync workbooks over outbound HTTPS without opening firewall ports.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
            Outbound Only
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
          <p className="text-slate-500"># 1. Start agent on your office server / PC pointing to the network share:</p>
          <p className="text-emerald-400 select-all">
            python sync-agent/agent.py --file &quot;\\company-nas\Warehouse\Stock_Records.xlsx&quot;
          </p>
          <p className="text-slate-500 mt-2"># 2. Or run as a Windows Scheduled Task every 30 minutes:</p>
          <p className="text-emerald-400 select-all">
            python sync-agent/agent.py --once
          </p>
        </div>
      </div>

      {/* Sync Execution History Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Synchronization Audit Log</span>
          </h3>
          <span className="text-xs text-slate-500">{syncStatus?.history?.length || 0} run(s) recorded</span>
        </div>

        {!syncStatus?.history || syncStatus.history.length === 0 ? (
          <p className="text-xs text-slate-400 p-6 text-center">No synchronization runs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Run Time</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4 text-right">Rows Read</th>
                  <th className="py-3 px-4 text-right">Inserted</th>
                  <th className="py-3 px-4 text-right">Updated</th>
                  <th className="py-3 px-4 text-right">Skipped</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {syncStatus.history.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {new Date(run.started_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{run.source_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        run.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {run.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertOctagon className="w-3 h-3 mr-1" />}
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{run.file_name}</td>
                    <td className="py-3 px-4 text-right text-slate-800 font-medium">{run.rows_read}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">+{run.rows_inserted}</td>
                    <td className="py-3 px-4 text-right text-blue-600 font-medium">{run.rows_updated}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{run.rows_skipped}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
