<h3 className="text-xl font-semibold mb-4">Team Discussion</h3>
              
              <div className="space-y-4 mb-6">
                {currentStrategy.comments && currentStrategy.comments.length > 0 ? (
                  currentStrategy.comments.map(comment => (
                    <div key={comment.id} className="bg-[#1E1A25] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#802BB1]/20 flex items-center justify-center text-[#802BB1] font-bold">
                            {comment.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-[#ECE8E1]/80 mt-1">{comment.text}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#ECE8E1]/60">
                    No comments yet. Be the first to add a comment!
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                />
                <button 
                  onClick={handleAddComment}
                  className="bg-[#802BB1] text-white px-4 py-2 rounded-lg hover:bg-[#9030d0] transition-all"
                  disabled={newComment.trim() === ""}
                >
                  Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playbook Modal */}
      {showPlaybookModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D283E] rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingPlaybook ? "Edit Playbook" : "Create New Playbook"}
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-2">Playbook Name</label>
              <input 
                type="text" 
                value={newPlaybookName}
                onChange={(e) => setNewPlaybookName(e.target.value)}
                placeholder="e.g., VCT Masters, Challengers, Scrims"
                className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-2">Select Maps</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {maps.map(map => (
                  <div 
                    key={map.id}
                    onClick={() => toggleMapSelection(map.id)}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedMapIds.includes(map.id) 
                        ? 'border-[#802BB1] bg-[#802BB1]/10' 
                        : 'border-[#564F6F] bg-[#1E1A25] hover:bg-[#1E1A25]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm border ${
                        selectedMapIds.includes(map.id) 
                          ? 'bg-[#802BB1] border-[#802BB1]' 
                          : 'border-[#ECE8E1]/40'
                      }`}>
                        {selectedMapIds.includes(map.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span>{map.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between gap-3 mt-8">
              <div>
                {editingPlaybook && playbooks.length > 1 && (
                  <button 
                    onClick={handleDeletePlaybook}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={18} />
                    Delete Playbook
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPlaybookModal(false)}
                  className="px-4 py-2 rounded-lg hover:bg-[#1E1A25] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePlaybook}
                  className="bg-[#802BB1] text-white px-6 py-2 rounded-lg hover:bg-[#9030d0] transition-all"
                  disabled={newPlaybookName.trim() === "" || selectedMapIds.length === 0}
                >
                  {editingPlaybook ? "Update Playbook" : "Create Playbook"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategies Popup */}
      {showStrategiesPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 md:items-center">
          <div className="bg-[#2D283E] rounded-t-xl md:rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">All {currentMap?.name} Strategies</h2>
              <button 
                onClick={() => setShowStrategiesPopup(false)}
                className="p-2 rounded-full hover:bg-[#1E1A25]"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {filteredStrategies.map((strategy, index) => (
                <div 
                  key={index}
                  onClick={() => handleStrategySelect(index)}
                  className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-[#1E1A25] transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={strategy.image} 
                      alt={strategy.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{strategy.title}</h3>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${
                        strategy.side === "Attack" ? "bg-[#FF4655]/20 text-[#FF4655]" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {strategy.side}
                      </div>
                    </div>
                    <p className="text-sm text-[#ECE8E1]/60 line-clamp-1">{strategy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImageModal && currentStrategy && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            <button 
              onClick={() => setShowFullImageModal(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-all z-10"
            >
              <X size={24} />
            </button>
            <img 
              src={currentStrategy.images ? currentStrategy.images[currentStrategy.currentImageIndex || 0] : currentStrategy.image} 
              alt={currentStrategy.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Floating Button for Strategies */}
      <button
        onClick={() => setShowStrategiesPopup(true)}
        className="fixed bottom-6 right-6 bg-[#802BB1] text-white p-4 rounded-full shadow-lg hover:bg-[#9030d0] transition-colors z-40"
      >
        <List size={24} />
      </button>
    </div>
  );
}

export default Playbook;