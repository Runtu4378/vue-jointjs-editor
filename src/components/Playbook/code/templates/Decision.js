export const base = `
"↵def {{ funcName }}(container):↵    
"""↵    
判断函数，判断您选择的数据是否符合预期值↵    
"""
↵↵    
{{ result }} = Falcon.filter(↵        
    container=container,↵        
    conditions=[↵            
        {{ conditions }}↵        
    ],↵        
    logical_operator={{ logicalOperator }},↵        
    action_name = {{ funcName }}↵    
    {{ search }}↵    )↵↵    
    {{ callback }}(container)↵↵    
    return↵"

`

export const decisionTemplate = `
def {{ funcName }}(container):
    """
    判断函数，decision
    """
    matched_results_1 = Falcon.filter(
        container=container,
        conditions=[
            {{ conditions }}
        ],
        logical_operator={{logicalOperator}},
        action_name={{funcName}}
    )
    if matched_results_1:
    digital_conversion_ip_1(container)
        {{ callback }}

    return
`
export const decisionelif =    
`
    {{ result }} = Falcon.filter(
        container=container,        
        conditions=[
            {{ conditions }}
        ],
        logical_operator={{ logicalOperator }},
        action_name="{{ funcName}}.{{ result }}"
        {{ search }}
    )
    if {{result}}:
        {{ callback }}
        return    

                                                        
`
export const decisionelse =
`
    {{ callback }}
return 
`
export const decisionif =
`
def {{ funcName }}(container):
    """
        判断函数，判断您选择的数据是否符合预期值 decision
    """
    {{ result }} = Falcon.filter(
        container=container,
        conditions=[
            {{ conditions }}
        ],
        logical_operator={{ logicalOperator }},
        action_name="{{ funcName }}.{{ result }}"
        {{ search }}
    )
    if {{result}}:                                                         
        {{ callback }}
        return            
    {{ elif }}
    {{ else_tmp }}   
`

export const Callback = 
`
    if {{ result }}:
            {{ nodeCallback }}
            
                    return
`