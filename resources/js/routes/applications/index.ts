import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::index
* @see app/Http/Controllers/UserApplicationController.php:15
* @route '/applications'
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
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/applications/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::create
* @see app/Http/Controllers/UserApplicationController.php:48
* @route '/applications/create'
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
* @see \App\Http\Controllers\UserApplicationController::store
* @see app/Http/Controllers/UserApplicationController.php:55
* @route '/applications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserApplicationController::store
* @see app/Http/Controllers/UserApplicationController.php:55
* @route '/applications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::store
* @see app/Http/Controllers/UserApplicationController.php:55
* @route '/applications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::store
* @see app/Http/Controllers/UserApplicationController.php:55
* @route '/applications'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::store
* @see app/Http/Controllers/UserApplicationController.php:55
* @route '/applications'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
export const show = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
show.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
show.get = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
show.head = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
const showForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
showForm.get = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::show
* @see app/Http/Controllers/UserApplicationController.php:152
* @route '/applications/{application}'
*/
showForm.head = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
export const edit = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/applications/{application}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
edit.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: args.application,
    }

    return edit.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
edit.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
edit.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
const editForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
editForm.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserApplicationController::edit
* @see app/Http/Controllers/UserApplicationController.php:92
* @route '/applications/{application}/edit'
*/
editForm.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
export const update = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
update.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: args.application,
    }

    return update.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
update.put = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
update.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
const updateForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
updateForm.put = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::update
* @see app/Http/Controllers/UserApplicationController.php:103
* @route '/applications/{application}'
*/
updateForm.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\UserApplicationController::destroy
* @see app/Http/Controllers/UserApplicationController.php:206
* @route '/applications/{application}'
*/
export const destroy = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserApplicationController::destroy
* @see app/Http/Controllers/UserApplicationController.php:206
* @route '/applications/{application}'
*/
destroy.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return destroy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::destroy
* @see app/Http/Controllers/UserApplicationController.php:206
* @route '/applications/{application}'
*/
destroy.delete = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserApplicationController::destroy
* @see app/Http/Controllers/UserApplicationController.php:206
* @route '/applications/{application}'
*/
const destroyForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::destroy
* @see app/Http/Controllers/UserApplicationController.php:206
* @route '/applications/{application}'
*/
destroyForm.delete = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\UserApplicationController::escalate
* @see app/Http/Controllers/UserApplicationController.php:185
* @route '/applications/{application}/escalate'
*/
export const escalate = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: escalate.url(args, options),
    method: 'post',
})

escalate.definition = {
    methods: ["post"],
    url: '/applications/{application}/escalate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserApplicationController::escalate
* @see app/Http/Controllers/UserApplicationController.php:185
* @route '/applications/{application}/escalate'
*/
escalate.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return escalate.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::escalate
* @see app/Http/Controllers/UserApplicationController.php:185
* @route '/applications/{application}/escalate'
*/
escalate.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: escalate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::escalate
* @see app/Http/Controllers/UserApplicationController.php:185
* @route '/applications/{application}/escalate'
*/
const escalateForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: escalate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::escalate
* @see app/Http/Controllers/UserApplicationController.php:185
* @route '/applications/{application}/escalate'
*/
escalateForm.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: escalate.url(args, options),
    method: 'post',
})

escalate.form = escalateForm

/**
* @see \App\Http\Controllers\UserApplicationController::resolve
* @see app/Http/Controllers/UserApplicationController.php:163
* @route '/applications/{application}/resolve'
*/
export const resolve = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/applications/{application}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserApplicationController::resolve
* @see app/Http/Controllers/UserApplicationController.php:163
* @route '/applications/{application}/resolve'
*/
resolve.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return resolve.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserApplicationController::resolve
* @see app/Http/Controllers/UserApplicationController.php:163
* @route '/applications/{application}/resolve'
*/
resolve.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::resolve
* @see app/Http/Controllers/UserApplicationController.php:163
* @route '/applications/{application}/resolve'
*/
const resolveForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserApplicationController::resolve
* @see app/Http/Controllers/UserApplicationController.php:163
* @route '/applications/{application}/resolve'
*/
resolveForm.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

const applications = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    escalate: Object.assign(escalate, escalate),
    resolve: Object.assign(resolve, resolve),
}

export default applications