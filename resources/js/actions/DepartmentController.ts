import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../wayfinder'
/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::index
* @see [unknown]:0
* @route '/departments'
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
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/departments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \DepartmentController::create
* @see [unknown]:0
* @route '/departments/create'
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
* @see \DepartmentController::store
* @see [unknown]:0
* @route '/departments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/departments',
} satisfies RouteDefinition<["post"]>

/**
* @see \DepartmentController::store
* @see [unknown]:0
* @route '/departments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \DepartmentController::store
* @see [unknown]:0
* @route '/departments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \DepartmentController::store
* @see [unknown]:0
* @route '/departments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \DepartmentController::store
* @see [unknown]:0
* @route '/departments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
export const edit = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/departments/{department}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
edit.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return edit.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
edit.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
edit.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
const editForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
editForm.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::edit
* @see [unknown]:0
* @route '/departments/{department}/edit'
*/
editForm.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
export const update = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/departments/{department}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
update.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return update.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
update.put = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
update.patch = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
const updateForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
updateForm.put = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \DepartmentController::update
* @see [unknown]:0
* @route '/departments/{department}'
*/
updateForm.patch = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \DepartmentController::destroy
* @see [unknown]:0
* @route '/departments/{department}'
*/
export const destroy = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/departments/{department}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \DepartmentController::destroy
* @see [unknown]:0
* @route '/departments/{department}'
*/
destroy.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return destroy.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \DepartmentController::destroy
* @see [unknown]:0
* @route '/departments/{department}'
*/
destroy.delete = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \DepartmentController::destroy
* @see [unknown]:0
* @route '/departments/{department}'
*/
const destroyForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \DepartmentController::destroy
* @see [unknown]:0
* @route '/departments/{department}'
*/
destroyForm.delete = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
export const assignManagers = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignManagers.url(args, options),
    method: 'get',
})

assignManagers.definition = {
    methods: ["get","head"],
    url: '/departments/{department}/assign-managers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
assignManagers.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return assignManagers.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
assignManagers.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignManagers.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
assignManagers.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assignManagers.url(args, options),
    method: 'head',
})

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
const assignManagersForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: assignManagers.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
assignManagersForm.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: assignManagers.url(args, options),
    method: 'get',
})

/**
* @see \DepartmentController::assignManagers
* @see [unknown]:0
* @route '/departments/{department}/assign-managers'
*/
assignManagersForm.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: assignManagers.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

assignManagers.form = assignManagersForm

/**
* @see \DepartmentController::syncManagers
* @see [unknown]:0
* @route '/departments/{department}/managers'
*/
export const syncManagers = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncManagers.url(args, options),
    method: 'post',
})

syncManagers.definition = {
    methods: ["post"],
    url: '/departments/{department}/managers',
} satisfies RouteDefinition<["post"]>

/**
* @see \DepartmentController::syncManagers
* @see [unknown]:0
* @route '/departments/{department}/managers'
*/
syncManagers.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return syncManagers.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \DepartmentController::syncManagers
* @see [unknown]:0
* @route '/departments/{department}/managers'
*/
syncManagers.post = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncManagers.url(args, options),
    method: 'post',
})

/**
* @see \DepartmentController::syncManagers
* @see [unknown]:0
* @route '/departments/{department}/managers'
*/
const syncManagersForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncManagers.url(args, options),
    method: 'post',
})

/**
* @see \DepartmentController::syncManagers
* @see [unknown]:0
* @route '/departments/{department}/managers'
*/
syncManagersForm.post = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncManagers.url(args, options),
    method: 'post',
})

syncManagers.form = syncManagersForm

const DepartmentController = { index, create, store, edit, update, destroy, assignManagers, syncManagers }

export default DepartmentController