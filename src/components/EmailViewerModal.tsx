import React, { useState, useEffect } from 'react';
import { EmailRecord } from '../types';
import { CustomerApiService } from '../services/api';
import { Mail, X, CheckCircle, Clock, ShieldCheck, Building, User } from 'lucide-react';

interface EmailViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSerial?: string;
}

export const EmailViewerModal: React.FC<EmailViewerModalProps> = ({
  isOpen,
  onClose,
  activeSerial
}) => {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'customer' | 'management'>('customer');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  const loadEmails = async () => {
    setLoading(true);
    const data = await CustomerApiService.getEmailLogs();
    setEmails(data);
    if (data.length > 0) {
      // Find customer email matching activeSerial if possible
      const match = data.find(e => e.recipientType === 'customer' && (!activeSerial || e.serialNumber === activeSerial)) || data[0];
      setSelectedEmail(match);
      setActiveTab(match.recipientType);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const customerEmails = emails.filter(e => e.recipientType === 'customer');
  const managementEmails = emails.filter(e => e.recipientType === 'management');
  const currentList = activeTab === 'customer' ? customerEmails : managementEmails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Automated Email Notification System</h3>
              <p className="text-[11px] text-slate-400">Live delivery log for Customer & Grand Air Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Customer vs Management */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('customer');
              if (customerEmails.length > 0) setSelectedEmail(customerEmails[0]);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'customer'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Confirmation Emails ({customerEmails.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('management');
              if (managementEmails.length > 0) setSelectedEmail(managementEmails[0]);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'management'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>Management Alert Emails ({managementEmails.length})</span>
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[350px]">
          {/* List Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50/60 max-h-[350px] md:max-h-full">
            {currentList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No emails sent in this category yet. Scan and register a fan to trigger automated emails!
              </div>
            ) : (
              currentList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEmail(item)}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition-all border ${
                    selectedEmail?.id === item.id
                      ? 'bg-blue-50 border-blue-300 shadow-xs text-blue-900'
                      : 'bg-white border-slate-200 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-slate-600 truncate">{item.serialNumber}</span>
                    <span>{new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-bold truncate text-slate-900 text-xs">
                    {item.subject}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">
                    To: {item.to}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Email Preview Pane */}
          <div className="md:col-span-8 p-4 sm:p-6 overflow-y-auto bg-slate-100 flex flex-col justify-start">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Meta details */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Subject</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Delivered Automatically</span>
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{selectedEmail.subject}</div>
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">From: </span>
                      <strong className="text-slate-700">{selectedEmail.from}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">To: </span>
                      <strong className="text-slate-700">{selectedEmail.to}</strong>
                    </div>
                  </div>
                </div>

                {/* Rendered HTML Preview */}
                <div 
                  className="bg-white rounded-2xl border border-slate-200 shadow-md p-2 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Select an email from the left sidebar to preview full contents.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SMTP & Dispatch Engine • Grand Air Electronics Automated Notification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

