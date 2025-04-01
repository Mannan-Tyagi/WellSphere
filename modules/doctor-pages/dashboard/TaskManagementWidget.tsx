import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, ChevronRight, Plus, Clock, Calendar, AlertCircle, CheckCircle, X, MoreHorizontal, Filter, Edit, Trash2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

const TaskManagementWidget = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review lab results for Sarah Johnson',
      description: 'Check blood work and update patient record',
      dueDate: addDays(new Date(), 0), // Today
      priority: 'high',
      completed: false,
      category: 'patient',
      assignedBy: 'self',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 2,
      title: 'Complete medical certification form',
      description: 'For patient Michael Rodriguez',
      dueDate: addDays(new Date(), 1), // Tomorrow
      priority: 'medium',
      completed: false,
      category: 'administrative',
      assignedBy: 'self',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    },
    {
      id: 3,
      title: 'Call pharmacy about prescription',
      description: 'Clarify dosage for Emma Wilson',
      dueDate: addDays(new Date(), 0), // Today
      priority: 'medium',
      completed: false,
      category: 'patient',
      assignedBy: 'Nurse Thompson',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
    },
    {
      id: 4,
      title: 'Prepare presentation for medical conference',
      description: 'Slides on new treatment protocols',
      dueDate: addDays(new Date(), 5), // 5 days from now
      priority: 'low',
      completed: false,
      category: 'professional',
      assignedBy: 'self',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
    },
    {
      id: 5,
      title: 'Update patient treatment plan',
      description: 'For Robert Williams after latest test results',
      dueDate: addDays(new Date(), -1), // Yesterday (overdue)
      priority: 'high',
      completed: false,
      category: 'patient',
      assignedBy: 'Dr. Jessica Lee',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36) // 36 hours ago
    },
    {
      id: 6,
      title: 'Review new clinical guidelines',
      description: 'Updated hypertension management protocol',
      dueDate: addDays(new Date(), 2), // 2 days from now
      priority: 'medium',
      completed: true,
      category: 'professional',
      assignedBy: 'self',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96) // 4 days ago
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    category: 'patient'
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return !task.completed;
    if (filter === 'today') return isToday(task.dueDate) && !task.completed;
    if (filter === 'high') return task.priority === 'high' && !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'overdue') return isPast(task.dueDate) && !isToday(task.dueDate) && !task.completed;
    return !task.completed;
  });

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Add new task
  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: tasks.length + 1,
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      completed: false,
      assignedBy: 'self',
      createdAt: new Date()
    };
    
    setTasks([...tasks, task]);
    setShowAddModal(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      category: 'patient'
    });
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setShowActionMenu(null);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format due date
  const formatDueDate = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue: ${format(date, 'MMM d')}`;
    return format(date, 'MMM d');
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <CheckSquare className="mr-2" size={20} />
          Tasks
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-1.5 rounded-full bg-[#F0F9FA] text-[#006D77] hover:bg-[#E8F3F4] transition-colors"
          aria-label="Add task"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Filter tabs */}
      <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 text-xs">
        <button 
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          All Tasks
        </button>
        <button 
          onClick={() => setFilter('today')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'today' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          <Clock size={12} className="mr-1" /> Today
        </button>
        <button 
          onClick={() => setFilter('high')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'high' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          <AlertCircle size={12} className="mr-1" /> High Priority
        </button>
        <button 
          onClick={() => setFilter('overdue')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'overdue' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          <Clock size={12} className="mr-1" /> Overdue
        </button>
      </div>
      
      {/* Tasks List */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`p-3 rounded-md border ${isPast(task.dueDate) && !isToday(task.dueDate) && !task.completed ? 'border-red-300 bg-red-50' : 'border-gray-100'} relative`}
            >
              <div className="flex items-start">
                <button 
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`mr-3 p-1 rounded-full flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-[#006D77]'}`}
                >
                  {task.completed ? <CheckCircle size={20} /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
                </button>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <div className="relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === task.id ? null : task.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {/* Action menu */}
                      {showActionMenu === task.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-md z-10 w-32">
                          <button 
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              // Edit functionality would go here
                              setShowActionMenu(null);
                            }}
                          >
                            <Edit size={14} className="mr-2" /> Edit
                          </button>
                          <button 
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 size={14} className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                  )}
                  
                  <div className="flex items-center mt-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="ml-2 flex items-center text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {formatDueDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>{filter === 'completed' ? 'No completed tasks' : 'No tasks found'}</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-sm text-[#006D77] hover:underline flex items-center mx-auto"
            >
              <Plus size={14} className="mr-1" />
              Add Task
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <Link href="/Doctor/Tasks" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
          View All Tasks <ChevronRight size={16} />
        </Link>
      </div>
      
      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Task</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Add details"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="patient">Patient Care</option>
                  <option value="administrative">Administrative</option>
                  <option value="professional">Professional Development</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTask}
                  className="px-4 py-2 bg-[#006D77] text-white rounded-md hover:bg-[#005A66]"
                  disabled={!newTask.title.trim()}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementWidget;