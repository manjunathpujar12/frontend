import React, { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Settings, ShieldAlert, Save, BellRing, Lock } from 'lucide-react';

export const SettingsPage = () => {
  const { showSuccess } = useToast();
  const [warningThreshold, setWarningThreshold] = useState('75');
  const [criticalThreshold, setCriticalThreshold] = useState('90');
  const [fiscalYear, setFiscalYear] = useState('2025 - 2026');
  const [currencySymbol, setCurrencySymbol] = useState('INR (₹)');
  const [autoEmailAlerts, setAutoEmailAlerts] = useState('Enabled');

  const handleSave = (e) => {
    e.preventDefault();
    showSuccess('Budget thresholds and system configuration saved!', 'Settings Updated');
  };

  return (
    <div className="space-y-6">
      <Header
        title="System & Financial Settings"
        subtitle="Manage fiscal year parameters, overspending alert thresholds, and security preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Thresholds Settings */}
        <Card>
          <CardHeader
            title="Overspending Alert Thresholds"
            subtitle="Trigger visual warnings when department spending crosses limits"
          />

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Warning Alert Threshold (%)"
              type="number"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(e.target.value)}
              helperText="Triggers warning badge when department spending reaches this %"
            />

            <Input
              label="Critical Alert Threshold (%)"
              type="number"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
              helperText="Triggers critical alert when department spending reaches this %"
            />

            <Input
              label="Active Academic Fiscal Year"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
            />

            <Button type="submit" variant="primary" icon={Save}>
              Save Configuration
            </Button>
          </form>
        </Card>

        {/* Security & Notification Preferences */}
        <Card>
          <CardHeader
            title="Notification & Audit Preferences"
            subtitle="Manage automated HOD email alerts and ledger logging"
          />

          <div className="space-y-4">
            <Select
              label="Automated Overspending Alerts"
              value={autoEmailAlerts}
              onChange={(e) => setAutoEmailAlerts(e.target.value)}
              options={['Enabled', 'Disabled (Manual Only)']}
            />

            <Select
              label="Default Display Currency"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              options={['INR (₹)', 'USD ($)', 'EUR (€)']}
            />

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Lock className="w-4 h-4" />
                <span>Role Security Active</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Department HOD accounts are restricted strictly to their assigned department ledger. College Admin permissions are required to modify baseline allocations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
