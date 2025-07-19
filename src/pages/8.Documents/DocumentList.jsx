import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { downloadDocumentService } from '../../store/tanstackStore/services/api';
import { useGetStudentDocuments } from '../../store/tanstackStore/services/queries';
import { useSocket } from '../../hooks/useSocket';
import { queryClient } from '../../utils/tanstack';

const DocumentList = ({ onDocumentSelect }) => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [socketEvent, setSocketEvent] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const { data: response, isLoading, error, refetch } = useGetStudentDocuments();

  // Extract documents array from the response
  const documents = response?.documents || [];
  
  // Socket event handler to update state
  const handleDocumentUpdate = useCallback((data) => {
    if (data.type === 'document_upload_success' || data.type === 'new_document_uploaded') {
      setSocketEvent(data);
    }
  }, []);

  // Initialize socket connection
  useSocket(handleDocumentUpdate, null, null);

  // useEffect to handle socket events and refresh data
  useEffect(() => {
    if (socketEvent) {
      const refreshData = async () => {
        setIsRefreshing(true);
        try {
          const result = await refetch();
          toast.success('Document list updated!');
          setTimeout(() => {
            setForceUpdate(prev => prev + 1);
          }, 100);
        } catch (error) {
          console.error('Socket refresh error:', error);
          toast.error('Failed to refresh document list');
        } finally {
          setIsRefreshing(false);
          // Clear the socket event after processing
          setSocketEvent(null);
        }
      };

      refreshData();
    }
  }, [socketEvent, refetch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Clear cache and force fresh fetch
      queryClient.removeQueries({ queryKey: ['studentDocuments'] });
      queryClient.resetQueries({ queryKey: ['studentDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['studentDocuments'] });
      
      // Force a fresh refetch
      await queryClient.refetchQueries({ queryKey: ['studentDocuments'] });
      
      toast.success('Document list refreshed successfully!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh document list');
    } finally {
      setIsRefreshing(false);
    }
  };

  const downloadMutation = useMutation({
    mutationFn: downloadDocumentService,
    onSuccess: (response, variables) => {
      // Get the document from the variables or find it in the documents array
      const documentRecord = documents.find(doc => doc.id === variables.documentId);
      
      // Use the original filename from the document record
      const filename = documentRecord?.fileName || variables.filename || 'document';
      
      // Get the blob data from the response
      const data = response.data;
      
      // Create blob and download
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document downloaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to download document');
    }
  });

  const handleDownload = (document) => {
    downloadMutation.mutate({
      documentId: document.id,
      filename: document.fileName || document.title
    });
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'PROPOSAL':
        return 'bg-blue-100 text-blue-800';
      case 'DISSERTATION':
        return 'bg-green-100 text-green-800';
      case 'CHAPTER':
        return 'bg-purple-100 text-purple-800';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'PROPOSAL':
        return 'Proposal';
      case 'DISSERTATION':
        return 'Dissertation';
      case 'CHAPTER':
        return 'Chapter';
      case 'OTHER':
        return 'Other';
      default:
        return type;
    }
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesFilter = filter === 'ALL' || 
                         (filter === 'REVIEWED' ? doc.isReviewed : doc.type === filter);
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load documents</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold text-gray-900">My Documents</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="ALL">All Documents</option>
            <option value="PROPOSAL">Proposals</option>
            <option value="DISSERTATION">Dissertations</option>
            <option value="CHAPTER">Chapters</option>
            <option value="REVIEWED">Reviewed</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <svg className="w-4 h-4 animate-spin mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by uploading your first document.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onDocumentSelect(document)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {document.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(document.type)}`}>
                      {getDocumentTypeLabel(document.type)}
                    </span>
                    {document.isReviewed && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Reviewed
                      </span>
                    )}
                  </div>
                  
                  {document.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {document.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Uploaded: {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}</span>
                    {document.uploadedBy && (
                      <span>By: {document.uploadedBy.name}</span>
                    )}
                    {document.fileSize && (
                      <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                    {document.supervisor && (
                      <span>To: {document.supervisor.title} {document.supervisor.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(document);
                    }}
                    disabled={downloadMutation.isPending}
                    className="p-3 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors duration-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download document"
                  >
                    {downloadMutation.isPending ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList; 