import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BusinessConfig, Task, TaskCategory, TaskPriority } from '../types';
import { getRelativeDate } from '../data/mockData';

interface TasksTabProps {
  businessConfig: BusinessConfig;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewModal: () => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  businessConfig,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenNewModal,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const categoryLabels: Record<TaskCategory, string> = {
    apertura_cierre: 'Apertura & Cierre',
    proveedores: 'Proveedores & Compras',
    clientes: 'Atención a Clientes',
    administracion: 'Administración & Finanzas',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Tareas y Responsabilidades del Negocio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Reparte y supervisa responsabilidades del equipo para que nunca se olviden compras de insumos, aperturas ni cuadres de caja.
          </p>
        </div>
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Total de Tareas</div>
          <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums mt-1">
            {tasks.length}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
          <div className="text-xs text-amber-700 font-medium">Pendientes</div>
          <div className="text-xl font-bold font-mono text-amber-700 tabular-nums mt-1">
            {pendingCount}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
          <div className="text-xs text-emerald-700 font-medium">Completadas</div>
          <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
            {completedCount}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Cumplimiento</div>
          <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums mt-1">
            {tasks.length > 0 ? `${Math.round((completedCount / tasks.length) * 100)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3.5 bg-white rounded-lg border border-neutral-200 flex flex-wrap items-center gap-3">
        <div className="text-xs font-medium text-neutral-500">Filtrar por:</div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-1 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
        >
          <option value="all">Todas las categorías</option>
          <option value="apertura_cierre">Apertura & Cierre</option>
          <option value="proveedores">Proveedores & Compras</option>
          <option value="clientes">Clientes</option>
          <option value="administracion">Administración & Caja</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="py-1 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
        >
          <option value="all">Todas las prioridades</option>
          <option value="urgente">Prioridad Urgente</option>
          <option value="normal">Prioridad Normal</option>
          <option value="baja">Prioridad Baja</option>
        </select>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-neutral-200">
          <CheckSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No hay tareas con estos filtros</h3>
          <p className="text-xs text-neutral-500 mt-1">Agrega una tarea o prueba otros filtros.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 bg-white rounded-lg border transition-all flex items-start justify-between gap-3 ${
                t.completed
                  ? 'border-neutral-200 bg-neutral-50/50 opacity-70'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => onToggleTask(t.id)}
                  className="mt-1 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <div className="space-y-1">
                  <div
                    className={`text-sm font-medium ${
                      t.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span className="font-medium text-neutral-700">Asignado: {t.assignee}</span>
                    <span aria-hidden="true">·</span>
                    <span>{categoryLabels[t.category]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Vence: {t.dueDate}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-medium ${
                        t.priority === 'urgente'
                          ? 'text-rose-700 font-semibold'
                          : t.priority === 'normal'
                          ? 'text-neutral-700'
                          : 'text-neutral-400'
                      }`}
                    >
                      {t.priority === 'urgente' ? 'Urgente' : t.priority === 'normal' ? 'Normal' : 'Baja'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(t.id)}
                className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                title="Eliminar tarea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
