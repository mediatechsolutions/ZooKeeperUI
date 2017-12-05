package com.rfranco.zookeeperrestapi.controllers;

import com.rfranco.zookeeperrestapi.autogenerated.api.ConfigApi;
import com.rfranco.zookeeperrestapi.autogenerated.dtos.*;
import com.rfranco.zookeeperrestapi.exceptions.ForbiddenException;
import com.rfranco.zookeeperrestapi.exceptions.InternalServerErrorException;
import com.rfranco.zookeeperrestapi.exceptions.NodeAlreadyExistsException;
import com.rfranco.zookeeperrestapi.exceptions.NotFoundException;
import com.rfranco.zookeeperrestapi.services.ZooKeeperService;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * Created by ruben.martinez on 21/11/2017.
 */
@RestController
public class NodesController implements ConfigApi {
    private Logger logger = LoggerFactory.getLogger(NodesController.class);
    @Autowired
    private ZooKeeperService zooKeeperService;

    @Override
    public ResponseEntity<Void> addNodeChild(@ApiParam(value = "The path of the node that will be added a child (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath, @ApiParam(value = "The data of the new node (name and value).") @Valid @RequestBody NodeCreationRequest body) {
        try {
            zooKeeperService.addNode(unEscapePath(nodePath), body);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(NotFoundException ex) {
            throw ex;
        } catch(NodeAlreadyExistsException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to add a node child.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<Void> deleteNode(@ApiParam(value = "The path of the node whose data will be deleted (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath) {
        try {
            zooKeeperService.deleteNode(unEscapePath(nodePath));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(NotFoundException | ForbiddenException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to delete anode.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<ChildrenNodes> getNodeChildren(@ApiParam(value = "The path of the node whose children will be retrieved (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath) {
        try {
            return ResponseEntity.ok(new ChildrenNodes().children(zooKeeperService.getNodeChildren(unEscapePath(nodePath))));
        } catch(NotFoundException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to get the children of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<NodeData> getNodeData(@ApiParam(value = "The path of the node whose data will be retrieved (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath) {
        try {
            return ResponseEntity.ok(new NodeData().data(zooKeeperService.getNodeData(unEscapePath(nodePath))));
        } catch(NotFoundException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to get the data of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<NodeDataType> getNodeDataType(@ApiParam(value = "The path of the node whose data type will be retrieved (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath) {
        try {
            return ResponseEntity.ok(zooKeeperService.getNodeDataType(unEscapePath(nodePath)));
        } catch(Exception ex) {
            logger.error("An error occurred while trying to get the data type of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<NodeExport> getNodeExport(@ApiParam(value = "The path of the node whose data will be exported (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath) {
        try {
            return ResponseEntity.ok(zooKeeperService.getNodeExport(unEscapePath(nodePath)));
        } catch(NotFoundException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to get the export of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<Void> restoreNodeExport(@ApiParam(value = "The path of the node whose data will be restored (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath, @ApiParam(value = "Indicates whether the import should prune nodes existing in ZooKeeper that do not exist in the export. The default is `false`.", defaultValue = "false") @RequestParam(value = "prune", required = false, defaultValue = "false") Boolean prune, @ApiParam(value = "Indicates whether the value of already existing nodes should be overwritten. The default is `true`.", defaultValue = "true") @RequestParam(value = "overwrite", required = false, defaultValue = "true") Boolean overwrite, @ApiParam(value = "The node export that will be restored into the specified path.") @Valid @RequestBody NodeExport node) {
        try {
            zooKeeperService.restoreNodeExport(unEscapePath(nodePath), node, prune, overwrite);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(NotFoundException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to restore a node export.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<Void> setNodeData(@ApiParam(value = "The path of the node whose data will be set (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath, @ApiParam(value = "The data to set to the given node.") @Valid @RequestBody NodeData nodeData) {
        try {
            zooKeeperService.setNodeData(unEscapePath(nodePath), nodeData.getData());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(NotFoundException | ForbiddenException ex) {
            throw ex;
        } catch(Exception ex) {
            logger.error("An error occurred while trying to set the data of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    @Override
    public ResponseEntity<Void> setNodeDataType(@ApiParam(value = "The path of the node whose data will be restored (using ~~ instead of / as zpath separator).", required = true) @PathVariable("nodePath") String nodePath, @ApiParam(value = "The node data type to set to the node at the specified path.", required = true) @Valid @RequestBody NodeDataType nodeDataType) {
        try {
            zooKeeperService.setNodeDataType(unEscapePath(nodePath), nodeDataType);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(Exception ex) {
            logger.error("An error occurred while trying to set the data type of a node.", ex);
            throw new InternalServerErrorException(ex.getMessage(), ex);
        }
    }

    private String unEscapePath(String path) {
        return path.replace("~~", "/");
    }
}
