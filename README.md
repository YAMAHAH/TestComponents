1.1.控制单据是否可以重复打开

    列表/明细/分组

1.2.关闭非导航树页面时,不要影响导航树活动页选择 [x]
  
  1.2.1.最小化和关闭对话框时都影响

1.3.Tab页面切换时,隐藏非活动页面所有已打开的非最小化窗体 [x]

1.4.活动页打开依赖组件时,支持添加到活动页的导航树中 [x]

  打开依赖组件设置干爹的时候,同时创建导航树结点,结点加字段指示引用结点
  

2.单据布局组件,分为左右上下中,可以自由控制显示或隐藏

3.支持页面和模态互换
   tab -> pageviewer,modal(append)

   pageviewer->modal:
     pv->modal:
     1.创建modal,添加pageviewer.content到modaloption的append,添加modelRef到views中

     2.隐藏pageviewer
     3.显示modal
     4.modal->pageviewer:
       4.1 恢复append到appendParent中
       4.2 隐藏modal
       4.3 显示pageviewer
     5.关闭pageviewer/modal:
       5.1.调用pageModel的factoryRef.close(pageModel);
       5.2.同时处理pageModel的views,views内容只处理销毁(dispose),数据逻辑还是在主的pageModel中处理
        
   modal->pageviewer:与上面的同理

   3.6 关闭一个page,page
   contentContainer
   contentElementRef.nativeElementRef


4.model支持添加

  4.1.直接指定组件方式:componentOutlets,传递数据上下文
  
  4.2.指定组件引用:componentRef,传递数据上下文
  
  4.3.已渲染的组件引用,并且组件已注入elementRef,把elementRef.nativeElement添加到Modal的append中


