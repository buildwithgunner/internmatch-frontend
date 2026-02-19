// import { useState, useEffect } from 'react';
// import api from '../../services/api.js';
// import Modal from './Modal.jsx';
// import Input from './Input.jsx';
// import Textarea from './Textarea.jsx';
// import Checkbox from './Checkbox.jsx';
// import Button from './Button.jsx';

// function ApplyModal({ internship, isOpen, onClose, onSuccess }) {
//   // DEBUG LOGS – These will tell us exactly what's happening
//   console.log('ApplyModal received internship:', internship);
//   console.log('ApplyModal - internship.id:', internship?.id);

//   const [coverLetter, setCoverLetter] = useState('');
//   const [portfolioUrl, setPortfolioUrl] = useState('');
//   const [selectedDocs, setSelectedDocs] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch student's uploaded documents when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setCoverLetter('');
//       setPortfolioUrl('');
//       setSelectedDocs([]);
//       setError('');

//       api
//         .get('/documents')
//         .then((res) => {
//           setDocuments(res.data.documents || []);
//         })
//         .catch((err) => {
//           setError('Failed to load your documents.');
//           console.error(err);
//         });
//     }
//   }, [isOpen]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // DEBUG LOG before submitting
//     console.log('About to submit - internship.id:', internship?.id);

//     // CRITICAL SAFETY CHECK – This prevents the 404 error
//     if (!internship?.id) {
//       setError('Error: Internship not loaded properly. Please refresh the page and try again.');
//       console.error('Missing internship ID! Full internship object:', internship);
//       setLoading(false);
//       return;
//     }

//     if (!coverLetter.trim()) {
//       setError('Cover letter is required.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // IMPORTANT: Add /api/v1 prefix unless your api.js already includes it
//       await api.post(`/api/v1/internships/${internship.id}/apply`, {
//         cover_letter_text: coverLetter.trim(),
//         portfolio_url: portfolioUrl.trim() || null,
//         document_types: selectedDocs,
//       });

//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         'Failed to submit application. Please try again.';
//       setError(message);
//       console.error('Apply error:', err.response?.data || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDocument = (type) => {
//     setSelectedDocs((prev) =>
//       prev.includes(type)
//         ? prev.filter((t) => t !== type)
//         : [...prev, type]
//     );
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${internship?.title || 'Internship'}`}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && <div className="alert alert-error">{error}</div>}

//         <div>
//           <p className="text-lg font-medium text-base-content/80">
//             {internship?.company?.company_name || internship?.company || 'Unknown Company'}
//           </p>
//         </div>

//         <Textarea
//           label="Cover Letter *"
//           value={coverLetter}
//           onChange={(e) => setCoverLetter(e.target.value)}
//           rows={8}
//           placeholder="Explain why you are a great fit for this internship..."
//           required
//         />

//         <Input
//           label="Portfolio URL (optional)"
//           value={portfolioUrl}
//           onChange={(e) => setPortfolioUrl(e.target.value)}
//           placeholder="https://yourportfolio.com"
//         />

//         <div>
//           <label className="label">
//             <span className="label-text font-medium">Attach Documents</span>
//           </label>
//           <div className="space-y-2 max-h-60 overflow-y-auto p-4 bg-base-200 rounded-box">
//             {documents.length === 0 ? (
//               <p className="text-base-content/60">
//                 No documents uploaded yet. Go to your Profile → Documents to add some.
//               </p>
//             ) : (
//               documents.map((doc) => (
//                 <Checkbox
//                   key={doc.id}
//                   label={`${doc.type.replace('_', ' ')} (${doc.original_name || 'Uploaded'})`}
//                   checked={selectedDocs.includes(doc.type)}
//                   onChange={(checked) => toggleDocument(doc.type)}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 pt-4">
//           <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="submit" variant="primary" loading={loading}>
//             Submit Application
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// }

// export default ApplyModal;