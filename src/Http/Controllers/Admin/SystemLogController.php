<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\File;
use Spatie\Activitylog\Models\Activity;
use Aminuddin12\FuturismeAdmin\Models\FuturismeVisit;
use Carbon\Carbon;

class SystemLogController extends FuturismeBaseController
{
    public function index(Request $request)
    {
        if (Gate::denies('view logs')) {
            abort(403);
        }

        $type = $request->input('type', 'activity');
        
        $data = match($type) {
            'system' => $this->getErrorLogs($request),
            'traffic' => $this->getTrafficLogs($request),
            default => $this->getActivityLogs($request)
        };

        return Inertia::render('Admin/SystemLog/Index', [
            'type' => $type,
            'filters' => $request->only(['search', 'date', 'level']),
            'data' => $data
        ]);
    }

    protected function getActivityLogs(Request $request)
    {
        $query = Activity::with('causer')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'ilike', "%{$search}%")
                  ->orWhere('event', 'ilike', "%{$search}%")
                  ->orWhereHas('causer', function($c) use ($search) {
                      $c->where('name', 'ilike', "%{$search}%");
                  });
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $logs = $query->paginate(20)->withQueryString();

        $grouped = $logs->getCollection()->groupBy(function($date) {
            return Carbon::parse($date->created_at)->format('Y-m-d');
        });

        return [
            'list' => $grouped,
            'pagination' => $logs
        ];
    }

    protected function getErrorLogs(Request $request)
    {
        $logPath = storage_path('logs');
        $files = File::glob($logPath . '/*.log');
        $logs = [];

        $currentFile = $request->input('file', 'laravel.log');
        $filePath = $logPath . '/' . $currentFile;

        if (File::exists($filePath)) {
            $content = File::get($filePath);
            $pattern = "/^\[(?<date>.*)\]\s(?<env>\w+)\.(?<level>\w+):(?<message>.*)/m";
            preg_match_all($pattern, $content, $matches, PREG_SET_ORDER, 0);

            foreach (array_reverse($matches) as $match) {
                $logs[] = [
                    'timestamp' => $match['date'],
                    'env' => $match['env'],
                    'level' => $match['level'],
                    'message' => trim($match['message']),
                    'id' => md5($match['date'] . $match['message'])
                ];
            }
        }

        if ($request->filled('search')) {
            $logs = array_filter($logs, function($log) use ($request) {
                return stripos($log['message'], $request->search) !== false || 
                       stripos($log['level'], $request->search) !== false;
            });
        }

        $fileList = array_map(function($f) {
            return basename($f);
        }, $files);

        return [
            'current_file' => $currentFile,
            'available_files' => $fileList,
            'logs' => array_values(array_slice($logs, 0, 100))
        ];
    }

    protected function getTrafficLogs(Request $request)
    {
        $query = FuturismeVisit::with(['user', 'admin'])->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('url', 'like', "%{$search}%")
                  ->orWhere('user_agent', 'like', "%{$search}%");
            });
        }

        $visits = $query->paginate(20)->withQueryString();
        $totalVisits = FuturismeVisit::count();
        $uniqueVisitors = FuturismeVisit::distinct('ip_address')->count();
        $authenticated = FuturismeVisit::whereNotNull('user_id')->count();
        $guests = $totalVisits - $authenticated;

        return [
            'stats' => [
                'total' => $totalVisits,
                'unique' => $uniqueVisitors,
                'auth' => $authenticated,
                'guest' => $guests
            ],
            'visits' => $visits
        ];
    }

    public function destroy(Request $request)
    {
        if (Gate::denies('view logs')) {
            abort(403);
        }

        if ($request->type === 'activity') {
            Activity::truncate();
        } elseif ($request->type === 'system') {
            $file = $request->input('file', 'laravel.log');
            File::put(storage_path('logs/' . $file), '');
        } elseif ($request->type === 'traffic') {
            FuturismeVisit::truncate();
        }

        return back()->with('success', 'Logs cleared successfully');
    }
}