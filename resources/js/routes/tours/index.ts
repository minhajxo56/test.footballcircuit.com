import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tours',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TourController::index
 * @see app/Http/Controllers/TourController.php:15
 * @route '/tours'
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
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tours/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TourController::create
 * @see app/Http/Controllers/TourController.php:21
 * @route '/tours/create'
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
* @see \App\Http\Controllers\TourController::store
 * @see app/Http/Controllers/TourController.php:40
 * @route '/tours'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tours',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TourController::store
 * @see app/Http/Controllers/TourController.php:40
 * @route '/tours'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::store
 * @see app/Http/Controllers/TourController.php:40
 * @route '/tours'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TourController::store
 * @see app/Http/Controllers/TourController.php:40
 * @route '/tours'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TourController::store
 * @see app/Http/Controllers/TourController.php:40
 * @route '/tours'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
export const show = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tours/{tour}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
show.url = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tour: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tour: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tour: args.tour,
                }

    return show.definition.url
            .replace('{tour}', parsedArgs.tour.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
show.get = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
show.head = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
    const showForm = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
        showForm.get = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TourController::show
 * @see app/Http/Controllers/TourController.php:84
 * @route '/tours/{tour}'
 */
        showForm.head = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
export const edit = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tours/{tour}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
edit.url = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tour: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tour: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tour: args.tour,
                }

    return edit.definition.url
            .replace('{tour}', parsedArgs.tour.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
edit.get = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
edit.head = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
    const editForm = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
        editForm.get = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TourController::edit
 * @see app/Http/Controllers/TourController.php:90
 * @route '/tours/{tour}/edit'
 */
        editForm.head = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
export const update = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tours/{tour}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
update.url = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tour: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tour: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tour: args.tour,
                }

    return update.definition.url
            .replace('{tour}', parsedArgs.tour.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
update.put = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
update.patch = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
    const updateForm = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
        updateForm.put = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TourController::update
 * @see app/Http/Controllers/TourController.php:112
 * @route '/tours/{tour}'
 */
        updateForm.patch = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TourController::destroy
 * @see app/Http/Controllers/TourController.php:0
 * @route '/tours/{tour}'
 */
export const destroy = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tours/{tour}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TourController::destroy
 * @see app/Http/Controllers/TourController.php:0
 * @route '/tours/{tour}'
 */
destroy.url = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tour: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tour: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tour: args.tour,
                }

    return destroy.definition.url
            .replace('{tour}', parsedArgs.tour.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TourController::destroy
 * @see app/Http/Controllers/TourController.php:0
 * @route '/tours/{tour}'
 */
destroy.delete = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TourController::destroy
 * @see app/Http/Controllers/TourController.php:0
 * @route '/tours/{tour}'
 */
    const destroyForm = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TourController::destroy
 * @see app/Http/Controllers/TourController.php:0
 * @route '/tours/{tour}'
 */
        destroyForm.delete = (args: { tour: string | number } | [tour: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tours = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default tours