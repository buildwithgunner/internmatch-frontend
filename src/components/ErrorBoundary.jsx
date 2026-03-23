import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-10 text-center space-y-6">
                        <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center">
                            <AlertTriangle size={32} className="text-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
                            <p className="text-slate-400 text-sm font-medium">
                                An unexpected error occurred. This has been logged for review.
                            </p>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <pre className="text-left text-xs text-rose-400 bg-slate-950 p-4 rounded-xl overflow-auto max-h-40 border border-slate-800">
                                {this.state.error.toString()}
                            </pre>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/20"
                        >
                            <RefreshCw size={18} /> Return Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
