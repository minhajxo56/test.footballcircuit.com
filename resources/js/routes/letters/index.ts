import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
export const compose = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: compose.url(options),
    method: 'get',
})

compose.definition = {
    methods: ["get","head"],
    url: '/letters/compose',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
compose.url = (options?: RouteQueryOptions) => {
    return compose.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
compose.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: compose.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
compose.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: compose.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
    const composeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: compose.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
        composeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: compose.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::compose
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/compose'
 */
        composeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: compose.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    compose.form = composeForm
/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/letters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:18
 * @route '/letters'
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
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/letters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:35
 * @route '/letters/create'
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
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:76
 * @route '/letters'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/letters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:76
 * @route '/letters'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:76
 * @route '/letters'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:76
 * @route '/letters'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:76
 * @route '/letters'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
export const show = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
show.url = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: args.letter,
                }

    return show.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
show.get = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
show.head = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
    const showForm = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
        showForm.get = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:245
 * @route '/letters/{letter}'
 */
        showForm.head = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
export const edit = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
edit.url = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: args.letter,
                }

    return edit.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
edit.get = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
edit.head = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
    const editForm = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
        editForm.get = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:139
 * @route '/letters/{letter}/edit'
 */
        editForm.head = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
export const update = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
update.url = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: args.letter,
                }

    return update.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
update.put = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
update.patch = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
    const updateForm = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
        updateForm.put = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:183
 * @route '/letters/{letter}'
 */
        updateForm.patch = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:0
 * @route '/letters/{letter}'
 */
export const destroy = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:0
 * @route '/letters/{letter}'
 */
destroy.url = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: args.letter,
                }

    return destroy.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:0
 * @route '/letters/{letter}'
 */
destroy.delete = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:0
 * @route '/letters/{letter}'
 */
    const destroyForm = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:0
 * @route '/letters/{letter}'
 */
        destroyForm.delete = (args: { letter: string | number } | [letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LetterController::acknowledge
 * @see app/Http/Controllers/LetterController.php:255
 * @route '/letters/{id}/acknowledge'
 */
export const acknowledge = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.definition = {
    methods: ["post"],
    url: '/letters/{id}/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterController::acknowledge
 * @see app/Http/Controllers/LetterController.php:255
 * @route '/letters/{id}/acknowledge'
 */
acknowledge.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return acknowledge.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::acknowledge
 * @see app/Http/Controllers/LetterController.php:255
 * @route '/letters/{id}/acknowledge'
 */
acknowledge.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterController::acknowledge
 * @see app/Http/Controllers/LetterController.php:255
 * @route '/letters/{id}/acknowledge'
 */
    const acknowledgeForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: acknowledge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::acknowledge
 * @see app/Http/Controllers/LetterController.php:255
 * @route '/letters/{id}/acknowledge'
 */
        acknowledgeForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: acknowledge.url(args, options),
            method: 'post',
        })
    
    acknowledge.form = acknowledgeForm
const letters = {
    compose: Object.assign(compose, compose),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
acknowledge: Object.assign(acknowledge, acknowledge),
}

export default letters