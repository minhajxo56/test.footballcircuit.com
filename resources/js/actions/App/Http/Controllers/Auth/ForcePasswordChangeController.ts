import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/force-password-change',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::create
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:13
 * @route '/force-password-change'
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
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::store
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:23
 * @route '/force-password-change'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/force-password-change',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::store
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:23
 * @route '/force-password-change'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::store
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:23
 * @route '/force-password-change'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::store
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:23
 * @route '/force-password-change'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\ForcePasswordChangeController::store
 * @see app/Http/Controllers/Auth/ForcePasswordChangeController.php:23
 * @route '/force-password-change'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const ForcePasswordChangeController = { create, store }

export default ForcePasswordChangeController