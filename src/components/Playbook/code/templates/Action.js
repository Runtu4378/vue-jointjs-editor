export const base = `
def <%= function_name %>(<%= args %>):
    phantom.debug('<%= function_name %>() called')
    <% if (from_callback) { %>
      #phantom.debug('Action: {0} {1}'.format(action['name'], ('SUCCEEDED' if success else 'FAILED')))
    <% } %>

    <%= collect_statements %>
    parameters = []
    <%= param_loop %>
    phantom.act("<%= action_call %>", parameters=parameters<% if (app) { %>, app={ "name": '<%= app %>' }<% } %><% if (assets) { %>, assets=[<%= assets %>]<% } %><% if (callback) { %>, callback=<%= callback %><% } %><% if (reviewer) { %>, reviewer="<%= reviewer %>"<% } %><% if (delay > 0) { %>, start_time=start_time<% } %><% if (custom_name) { %>, name="<%= custom_name %>"<% } %><% if (parent_action) { %>, parent_action=action<% } %>)

    return
`

export const mine = `
def {{ funcName }}(container):
    """
    在指定App下执行Action操作的函数
    """

    parameters = {  {{ parameters }}
    }

    Falcon.action(
          container=container,
          plugin_name={{ pluginName }},
          action_name={{ funcName }},
          name={{ name }},
          parameters=parameters,
          **kwargs
      )

    {{ callback }}

    return
`
