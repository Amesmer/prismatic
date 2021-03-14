//将HTML模板字符串转换成AST
/*
*{
  children: [{…}],
  parent: {},
  tag: "div",
  type: 1, //1-元素节点 2-带变量的文本节点 3-纯文本节点，
  expression:'_s(name)', //type如果是2，则返回_s(变量)
  text:'{{name}}' //文本节点编译前的字符串
}
*
* */
function parser(html) {
  let stack = []
  let root
  let currentParent
  while (html){
    let index = html.indexOf('<')
    if(index > 0){ //前面还有文本节点
      let text = html.slice(0,index)
      const element = parseText(text)
      element.parent = currentParent
      currentParent.children.push(element)
      html = html.slice(index)
    }else if(html[index + 1] !== '/'){ //前面没有文本节点，且是开始标签
      let gtIndex = html.indexOf('>')
      const element = {
        type: 1,
        tag:html.slice(index + 1,gtIndex),
        parent:currentParent,
        children:[],
      }
      if(!root){
        root = element
      }else {
        currentParent.children.push(element)
      }
      stack.push(element)
      currentParent = element
      html = html.slice(gtIndex + 1)
    }else { //结束标签
      let gtIndex = html.indexOf('>')
      stack.pop()
      currentParent = stack[stack.length - 1]
      html = html.slice(gtIndex + 1)
    }
  }
  return root
}

function parseText(text) {
  let originText = text
  let type = 3
  let tokens =[]
  while(text){
    let start = text.indexOf('{{')
    let end = text.indexOf('}}')
    if(start !== -1 && end !== -1){ //存在插值变量
      type = 2
      if(start > 0){ //前面还有纯文本
        tokens.push(JSON.stringify(text.slice(0,start)))
      }
      let exp = text.slice(start+2,end)
      tokens.push(`_s(${exp})`)
      text = text.slice(end + 2)
    }else {
      tokens.push(JSON.stringify(text))
      text = ''
    }
  }

  let element = {
    text:originText,
    type,
  }
  if(type === 2){
    element.expression = tokens.join('+')
  }
  return element
}