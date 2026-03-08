import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
export const mySchedule = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mySchedule.url(options),
    method: 'get',
})

mySchedule.definition = {
    methods: ["get","head"],
    url: '/my-schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
mySchedule.url = (options?: RouteQueryOptions) => {
    return mySchedule.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
mySchedule.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mySchedule.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
mySchedule.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mySchedule.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
    const myScheduleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mySchedule.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
        myScheduleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mySchedule.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScheduleController::mySchedule
 * @see app/Http/Controllers/ScheduleController.php:215
 * @route '/my-schedule'
 */
        myScheduleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mySchedule.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mySchedule.form = myScheduleForm
const schedule = {
    mySchedule: Object.assign(mySchedule, mySchedule),
}

export default schedule