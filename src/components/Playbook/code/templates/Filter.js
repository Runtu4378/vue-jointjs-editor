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

export const filterTemplate = `
def {{ funcName }}(container):
    """
    判断函数，判断您选择的数据是否符合预期值
    """
    matched_results_1 = Falcon.filter(
        container=container,
        conditions=[
            {{ conditions }}
        ],
        logical_operator={{logicalOperator}},
        action_name="{{funcName}}"
    )
    if matched_results_1:
        {{ callback }}

    return
`
