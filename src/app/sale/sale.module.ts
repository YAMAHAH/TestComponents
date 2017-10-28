import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { XYZUIModule } from '../common/rebirth-ui.module';
import { XYZDialogModule } from '../common/dialog/dialog.module';
import { NgModule, forwardRef } from '@angular/core';
import { PopoverModule } from '../common/popover/popover.module';
import { PanelModule } from '../common/panel/panel.module';
import { AccordionModule } from '../common/accordion/accordion.module';
import { AlertBoxModule } from '../common/alert-box/alert-box.module';
import { AdModule } from '../ad/ad.module';
import { ToastyModule } from '../common/toasty/index';
import { PanelTestComponent } from './panel.test.component';
import { ActionButtonModule } from '../common/action-button/action-button.module';
import { ModalTestComponent } from './modal.test.component';
import { WebFormModule } from '../components/form/FormModule';
import { OverlayPanelModule } from '../components/overlaypanel/overlaypanel';
import { DropdownModule } from '../components/dropdown/dropdown';
import { DropdownformModule } from '../components/dropdownform/dropDownForm.Module';
import { AutoCompleteModule } from '../components/autocomplete/autocomplete';
import { CalendarModule } from '../components/calendar/calendar';
import { DataTableModule } from '../components/datatable/datatable';
import { ColumnBodyComponent } from './columnBody';
import { DateColumnBodyComponent } from './dateColumnBody';
import { CellEditorComponent } from './cellEditor';
import { NavTreeViewModule } from '../components/nav-tree-view/nav-tree-view.module';
import { CoreModule } from '../common/shared/shared-module';
import { ReportViewerModule } from '../common/report-viewer/report.viewer.module';
import { TemplateClassBase } from '../Models/template-class';
import { extend } from '../untils/proxy';
import { getClassProviders } from '../untils/di-helper';
import { SaleOrderDataResolver } from './SaleOrderDataResolver';

export const saleRouteConfig: Routes = [
    {
        path: "", component: SaleComponent,
        data: {
            title: '销售模块',
            moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1"
        },
        resolve: {
            dataSource: SaleOrderDataResolver,
            resource: SaleOrderDataResolver
        }
    }
];
export class TenantManageTemplate extends TemplateClassBase {

    /** 属性 */
    TemplateId = "c256442e-4c39-a46b-62b3-6e1103d32f57";
    TempName = "TenantManage";
    ModuleId = "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1";
    ModuleName = "MultiTenant";
    /** 数据字段 */
    dataFields = {
        Tenant_Name: {
            objectId: "c256442e-4c39-a46b-62b3-6e1103d32f57", templateId: "c256442e-4c39-a46b-62b3-6e1103d32f57", moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1", name: "Name", queryable: true, required: true, visible: true, editable: true, text: "租户名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_IsMaster: {
            name: "IsMaster", queryable: true, required: true, visible: true, editable: true, text: "是否主租户",
            default: "", dataType: "Boolean", componentType: ""
        },
        Tenant_SuperAdminName: {
            name: "SuperAdminName", queryable: true, required: true, visible: true, editable: true, text: "超级管理员名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_CreateTime: {
            name: "CreateTime", queryable: true, required: true, visible: true, editable: false, text: "创建时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_UpdateTime: {
            name: "UpdateTime", queryable: true, required: true, visible: true, editable: true, text: "更新时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_Remark: {
            name: "Remark", queryable: true, required: false, visible: true, editable: true, text: "备注",
            default: "", dataType: "String", componentType: ""
        }
    };
}
export class TenantManageTemplate2 extends TemplateClassBase {

    /** 属性 */
    TemplateId = "c256442e-4c39-a46b-62b3-6e1103d32f57";
    TempName = "TenantManage";
    ModuleId = "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1";
    ModuleName = "MultiTenant";
    /** 数据字段 */
    dataFields = {
        Tenant_Name: {
            objectId: "c256442e-4c39-a46b-62b3-6e1103d32f57", templateId: "c256442e-4c39-a46b-62b3-6e1103d32f57", moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1", name: "Name", queryable: true, required: true, visible: true, editable: true, text: "租户名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_IsMaster: {
            name: "IsMaster", queryable: true, required: true, visible: true, editable: true, text: "是否主租户",
            default: "", dataType: "Boolean", componentType: ""
        },
        Tenant_SuperAdminName: {
            name: "SuperAdminName", queryable: true, required: true, visible: true, editable: true, text: "超级管理员名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_CreateTime: {
            name: "CreateTime", queryable: false, required: false, visible: false, editable: false, text: "创建时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_UpdateTime: {
            name: "UpdateTime", queryable: true, required: true, visible: true, editable: true, text: "更新时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_Remark: {
            name: "Remark", queryable: true, required: false, visible: true, editable: true, text: "备注",
            default: "", dataType: "String", componentType: ""
        }
    };
}

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(saleRouteConfig),
        XYZDialogModule, NavTreeViewModule,
        XYZUIModule,
        PopoverModule,
        PanelModule,
        AccordionModule,
        ActionButtonModule,
        AlertBoxModule,
        AdModule,
        ToastyModule,
        WebFormModule, OverlayPanelModule, DropdownModule, DropdownformModule,
        AutoCompleteModule, CalendarModule, DataTableModule, ReportViewerModule
    ],
    declarations: [
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent,
        ModalTestComponent,
        PanelTestComponent
    ],
    exports: [
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent
    ],
    entryComponents: [
        ModalTestComponent,
        PanelTestComponent,
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent
    ],
    providers: [
        ...getClassProviders([TenantManageTemplate, TenantManageTemplate2]),
        SaleOrderDataResolver
    ]
})
export class SaleModule {

}


