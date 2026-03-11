import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
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
* @see app/Http/Controllers/ScheduleController.php:172
* @route '/my-schedule'
*/
mySchedule.url = (options?: RouteQueryOptions) => {
    return mySchedule.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
* @route '/my-schedule'
*/
mySchedule.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mySchedule.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
* @route '/my-schedule'
*/
mySchedule.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mySchedule.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
* @route '/my-schedule'
*/
const myScheduleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mySchedule.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
* @route '/my-schedule'
*/
myScheduleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mySchedule.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::mySchedule
* @see app/Http/Controllers/ScheduleController.php:172
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

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules/publish'
*/
const storeb4885f4ade70e65c88da309cc8d9e9ca = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb4885f4ade70e65c88da309cc8d9e9ca.url(options),
    method: 'post',
})

storeb4885f4ade70e65c88da309cc8d9e9ca.definition = {
    methods: ["post"],
    url: '/schedules/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules/publish'
*/
storeb4885f4ade70e65c88da309cc8d9e9ca.url = (options?: RouteQueryOptions) => {
    return storeb4885f4ade70e65c88da309cc8d9e9ca.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules/publish'
*/
storeb4885f4ade70e65c88da309cc8d9e9ca.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb4885f4ade70e65c88da309cc8d9e9ca.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules/publish'
*/
const storeb4885f4ade70e65c88da309cc8d9e9caForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb4885f4ade70e65c88da309cc8d9e9ca.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules/publish'
*/
storeb4885f4ade70e65c88da309cc8d9e9caForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb4885f4ade70e65c88da309cc8d9e9ca.url(options),
    method: 'post',
})

storeb4885f4ade70e65c88da309cc8d9e9ca.form = storeb4885f4ade70e65c88da309cc8d9e9caForm
/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules'
*/
const storee1f9edf590e2d1f4bd9768a922a3f602 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storee1f9edf590e2d1f4bd9768a922a3f602.url(options),
    method: 'post',
})

storee1f9edf590e2d1f4bd9768a922a3f602.definition = {
    methods: ["post"],
    url: '/schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules'
*/
storee1f9edf590e2d1f4bd9768a922a3f602.url = (options?: RouteQueryOptions) => {
    return storee1f9edf590e2d1f4bd9768a922a3f602.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules'
*/
storee1f9edf590e2d1f4bd9768a922a3f602.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storee1f9edf590e2d1f4bd9768a922a3f602.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules'
*/
const storee1f9edf590e2d1f4bd9768a922a3f602Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storee1f9edf590e2d1f4bd9768a922a3f602.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::store
* @see app/Http/Controllers/ScheduleController.php:93
* @route '/schedules'
*/
storee1f9edf590e2d1f4bd9768a922a3f602Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storee1f9edf590e2d1f4bd9768a922a3f602.url(options),
    method: 'post',
})

storee1f9edf590e2d1f4bd9768a922a3f602.form = storee1f9edf590e2d1f4bd9768a922a3f602Form

export const store = {
    '/schedules/publish': storeb4885f4ade70e65c88da309cc8d9e9ca,
    '/schedules': storee1f9edf590e2d1f4bd9768a922a3f602,
}

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::index
* @see app/Http/Controllers/ScheduleController.php:20
* @route '/schedules'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/schedules/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::create
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
export const show = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/schedules/{schedule}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
show.url = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: args.schedule,
    }

    return show.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
show.get = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
show.head = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
const showForm = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
showForm.get = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::show
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
showForm.head = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
export const edit = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/schedules/{schedule}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
edit.url = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: args.schedule,
    }

    return edit.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
edit.get = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
edit.head = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
const editForm = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
editForm.get = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ScheduleController::edit
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}/edit'
*/
editForm.head = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
export const update = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/schedules/{schedule}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
update.url = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: args.schedule,
    }

    return update.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
update.put = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
update.patch = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
const updateForm = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
updateForm.put = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::update
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
updateForm.patch = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ScheduleController::destroy
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
export const destroy = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/schedules/{schedule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ScheduleController::destroy
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
destroy.url = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

    if (Array.isArray(args)) {
        args = {
            schedule: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        schedule: args.schedule,
    }

    return destroy.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScheduleController::destroy
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
destroy.delete = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ScheduleController::destroy
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
const destroyForm = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ScheduleController::destroy
* @see app/Http/Controllers/ScheduleController.php:0
* @route '/schedules/{schedule}'
*/
destroyForm.delete = (args: { schedule: string | number } | [schedule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ScheduleController = { mySchedule, store, index, create, show, edit, update, destroy }

export default ScheduleController