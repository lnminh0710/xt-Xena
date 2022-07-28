import { Routes, RouterModule } from "@angular/router";
import { CanActivateGuard } from "app/services";
import { NgModule } from "@angular/core";
import { AdvanceSearchComponent } from "./advance-search.component";

const routes: Routes = [
    {
        path: '',
        component: AdvanceSearchComponent,
        canActivate: [CanActivateGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdvanceSearchRoutingModule { }
