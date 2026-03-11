import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
const create187b624e9f0a3c2096f803f596f727f1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create187b624e9f0a3c2096f803f596f727f1.url(options),
    method: 'get',
})

create187b624e9f0a3c2096f803f596f727f1.definition = {
    methods: ["get","head"],
    url: '/letters/compose',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
create187b624e9f0a3c2096f803f596f727f1.url = (options?: RouteQueryOptions) => {
    return create187b624e9f0a3c2096f803f596f727f1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
create187b624e9f0a3c2096f803f596f727f1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create187b624e9f0a3c2096f803f596f727f1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
create187b624e9f0a3c2096f803f596f727f1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create187b624e9f0a3c2096f803f596f727f1.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
const create187b624e9f0a3c2096f803f596f727f1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create187b624e9f0a3c2096f803f596f727f1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
create187b624e9f0a3c2096f803f596f727f1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create187b624e9f0a3c2096f803f596f727f1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/compose'
*/
create187b624e9f0a3c2096f803f596f727f1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create187b624e9f0a3c2096f803f596f727f1.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create187b624e9f0a3c2096f803f596f727f1.form = create187b624e9f0a3c2096f803f596f727f1Form
/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
const createe6406af294e96faee045b34bfe28aff5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createe6406af294e96faee045b34bfe28aff5.url(options),
    method: 'get',
})

createe6406af294e96faee045b34bfe28aff5.definition = {
    methods: ["get","head"],
    url: '/letters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
createe6406af294e96faee045b34bfe28aff5.url = (options?: RouteQueryOptions) => {
    return createe6406af294e96faee045b34bfe28aff5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
createe6406af294e96faee045b34bfe28aff5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createe6406af294e96faee045b34bfe28aff5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
createe6406af294e96faee045b34bfe28aff5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createe6406af294e96faee045b34bfe28aff5.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
const createe6406af294e96faee045b34bfe28aff5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createe6406af294e96faee045b34bfe28aff5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
createe6406af294e96faee045b34bfe28aff5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createe6406af294e96faee045b34bfe28aff5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::create
* @see app/Http/Controllers/LetterController.php:35
* @route '/letters/create'
*/
createe6406af294e96faee045b34bfe28aff5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createe6406af294e96faee045b34bfe28aff5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createe6406af294e96faee045b34bfe28aff5.form = createe6406af294e96faee045b34bfe28aff5Form

export const create = {
    '/letters/compose': create187b624e9f0a3c2096f803f596f727f1,
    '/letters/create': createe6406af294e96faee045b34bfe28aff5,
}

/**
* @see \App\Http\Controllers\LetterController::acknowledge
* @see app/Http/Controllers/LetterController.php:112
* @route '/letters/{letter}/acknowledge'
*/
export const acknowledge = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.definition = {
    methods: ["post"],
    url: '/letters/{letter}/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterController::acknowledge
* @see app/Http/Controllers/LetterController.php:112
* @route '/letters/{letter}/acknowledge'
*/
acknowledge.url = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { letter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            letter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter: typeof args.letter === 'object'
        ? args.letter.id
        : args.letter,
    }

    return acknowledge.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::acknowledge
* @see app/Http/Controllers/LetterController.php:112
* @route '/letters/{letter}/acknowledge'
*/
acknowledge.post = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterController::acknowledge
* @see app/Http/Controllers/LetterController.php:112
* @route '/letters/{letter}/acknowledge'
*/
const acknowledgeForm = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterController::acknowledge
* @see app/Http/Controllers/LetterController.php:112
* @route '/letters/{letter}/acknowledge'
*/
acknowledgeForm.post = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.form = acknowledgeForm

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
* @see \App\Http\Controllers\LetterController::store
* @see app/Http/Controllers/LetterController.php:41
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
* @see app/Http/Controllers/LetterController.php:41
* @route '/letters'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::store
* @see app/Http/Controllers/LetterController.php:41
* @route '/letters'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterController::store
* @see app/Http/Controllers/LetterController.php:41
* @route '/letters'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterController::store
* @see app/Http/Controllers/LetterController.php:41
* @route '/letters'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
export const show = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
show.url = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { letter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            letter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter: typeof args.letter === 'object'
        ? args.letter.id
        : args.letter,
    }

    return show.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
show.get = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
show.head = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
const showForm = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
showForm.get = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::show
* @see app/Http/Controllers/LetterController.php:105
* @route '/letters/{letter}'
*/
showForm.head = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
export const edit = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
edit.url = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { letter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            letter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter: typeof args.letter === 'object'
        ? args.letter.id
        : args.letter,
    }

    return edit.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
edit.get = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
edit.head = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
const editForm = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
editForm.get = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterController::edit
* @see app/Http/Controllers/LetterController.php:72
* @route '/letters/{letter}/edit'
*/
editForm.head = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
export const update = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LetterController::update
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
update.url = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { letter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            letter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter: typeof args.letter === 'object'
        ? args.letter.id
        : args.letter,
    }

    return update.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::update
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
update.put = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LetterController::update
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
update.patch = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LetterController::update
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
const updateForm = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
updateForm.put = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/LetterController.php:79
* @route '/letters/{letter}'
*/
updateForm.patch = (args: { letter: string | number | { id: string | number } } | [letter: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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

const LetterController = { create, acknowledge, index, store, show, edit, update, destroy }

export default LetterController