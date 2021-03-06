import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Node } from '../../model/Node';
import { ConfigApi } from '../../autogenerated/api/ConfigApi';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertList, Alert, AlertType} from '../alerts/alerts.component';
import { NodeDataType } from '../../autogenerated/model/NodeDataType';
import JSONEditor from 'jsoneditor';
import { JSONEditorOptions } from 'jsoneditor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() node: Node;
  editing: boolean;
  modalRef: BsModalRef;
  alerts: AlertList;
  _editedValue: string;
  nodeDataTypes: string[] = Object.values(NodeDataType);
  NodeDataType = NodeDataType;
  @ViewChild('jsoneditor') jsonEditorContainer: any;
  jsonEditor: JSONEditor;

  constructor(private _configApi : ConfigApi,
              private modalService: BsModalService) {
    this.alerts = new AlertList();
    this.editing = false;
  }

  ngOnInit() {
    if ((window as any).jasmine === undefined)
    {
      this.jsonEditor = new JSONEditor(this.jsonEditorContainer.nativeElement, {});
      this.jsonEditor.setMode('code');
    }

    this.retrieveNodeData();
    this.retrieveNodeDataType();
  }

  get editedValue(): string {
    if (this.node.type === NodeDataType.Json) {
      return this.jsonEditor.getText();
    } else {
      return this._editedValue === null ? "" : this._editedValue;
    }
  }

  set editedValue(value: string) {
    if (this.node.type === NodeDataType.Json) {
      this.jsonEditor.setText(this.node.value);
    } else {
      this._editedValue = value;
    }
  }

  setNodeData() {
    this.node.value = this.editedValue;
    this._configApi.setNodeData(this.node.path, { data: this.node.value }).subscribe(
      data => {
        this.alerts.addAlert({
          alertType: AlertType.Success,
          message: 'Node value correctly saved',
          timeOut: 4000
        });
        this.editing = false;
      },
      error => {
        this.alerts.addAlert(Alert.fromResponse(error));
      }
    );
  }

  onValueEdited(event: any): void {
    // The pressed key is enter
    if (event.keyCode == 13) {
      this.editing = false;
      this.setNodeData();
    }

    // The pressed key is escape
    if (event.keyCode == 27) {
      this.cancelEdition();
    }
  }

  cancelEdition() {
    this.editing = false;
    this.editedValue = this.node.value;
  }

  openDeletionModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }

  confirmDeletion() {
    this.modalRef.hide();
    this._configApi.deleteNode(this.node.path).subscribe(
      data => {
        this.node.delete();
      },
      error => {
        this.alerts.addAlert(Alert.fromResponse(error));
      }
    );
  }

  retrieveNodeData() {
    this._configApi.getNodeData(this.node.path)
      .subscribe(
        nodeData => {
          this.node.value = nodeData.data;
          this.editedValue = nodeData.data;
          if (this.jsonEditor)
            this.jsonEditor.setText(nodeData.data);
        },
        error => {
          this.alerts.addAlert(Alert.fromResponse(error));
        }
      );
  }

  retrieveNodeDataType() {
    this._configApi.getNodeDataType(this.node.path)
      .subscribe(
        (nodeDataType: NodeDataType) => {
          this.node.type = nodeDataType;
        },
        error => {
          this.alerts.addAlert(Alert.fromResponse(error));
        }
      );
  }

  setDataType(type: string) {
    let nodeDataType = NodeDataType[type];

    this._configApi.setNodeDataType(this.node.path, nodeDataType)
      .subscribe(
        () => {
          this.node.type = nodeDataType;
          if (nodeDataType === NodeDataType.Json) {
            this.jsonEditor.set(JSON.parse(this.node.value));
          }
          this.alerts.addAlert({
            alertType: AlertType.Success,
            message: "Node type successfully changed!",
            timeOut: 4000
          })
        },
        error => {
          this.alerts.addAlert(Alert.fromResponse(error));
        }
      );
  }
}
